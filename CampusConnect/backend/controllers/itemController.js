const db = require('../config/db');
const { calculateMatchScore } = require('../utils/matchLogic');

// @desc    Create an item (lost or found)
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const { type, title, description, category, color, brand, date, location } = req.body;
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    if (!type || !title || !category || !date || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const [result] = await db.query(
      `INSERT INTO items (user_id, type, title, description, category, color, brand, date, location, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, type, title, description, category, color, brand, date, location, image_url]
    );

    const newItemId = result.insertId;

    // Trigger auto-match logic
    await autoMatchNewItem(newItemId, type, req);

    res.status(201).json({ id: newItemId, message: 'Item created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all items (with filters)
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const { type, category, status } = req.query;
    
    let query = 'SELECT items.*, users.name as user_name FROM items JOIN users ON items.user_id = users.id WHERE 1=1';
    const params = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    } else {
      query += " AND status = 'active'";
    }

    query += ' ORDER BY created_at DESC';

    const [items] = await db.query(query, params);
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const [items] = await db.query(
      'SELECT items.*, users.name as user_name, users.email as user_email FROM items JOIN users ON items.user_id = users.id WHERE items.id = ?',
      [req.params.id]
    );

    if (items.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(items[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's items
// @route   GET /api/items/user/me
// @access  Private
const getMyItems = async (req, res) => {
  try {
    const [items] = await db.query('SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update item status to claimed
// @route   PUT /api/items/:id/claim
// @access  Private
const claimItem = async (req, res) => {
  try {
    const [item] = await db.query('SELECT * FROM items WHERE id = ?', [req.params.id]);
    if (item.length === 0) return res.status(404).json({ message: 'Item not found' });

    if (item[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await db.query("UPDATE items SET status = 'claimed' WHERE id = ?", [req.params.id]);
    res.json({ message: 'Item marked as claimed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const [item] = await db.query('SELECT * FROM items WHERE id = ?', [req.params.id]);
    if (item.length === 0) return res.status(404).json({ message: 'Item not found' });

    if (item[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await db.query('DELETE FROM items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Item removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Auto Match Logic Helper
const autoMatchNewItem = async (newItemId, type, req) => {
  try {
    const [newItems] = await db.query('SELECT * FROM items WHERE id = ?', [newItemId]);
    const newItem = newItems[0];
    
    const oppositeType = type === 'lost' ? 'found' : 'lost';
    const [oppositeItems] = await db.query(
      "SELECT * FROM items WHERE type = ? AND status = 'active'",
      [oppositeType]
    );

    for (let item of oppositeItems) {
      const score = calculateMatchScore(newItem, item);
      if (score >= 0.6) { // 60% threshold
        const lost_id = type === 'lost' ? newItem.id : item.id;
        const found_id = type === 'found' ? newItem.id : item.id;
        
        await db.query(
          'INSERT INTO matches (lost_item_id, found_item_id, similarity_score) VALUES (?, ?, ?)',
          [lost_id, found_id, score]
        );

        // Notify users if socket is available
        const io = req.app.get('io');
        if (io) {
          if (type === 'lost') {
            io.to(`user_${newItem.user_id}`).emit('new_match', { message: 'New potential match for your lost item!', itemId: newItem.id });
            io.to(`user_${item.user_id}`).emit('new_match', { message: 'Your found item might match a lost item!', itemId: item.id });
          } else {
            io.to(`user_${item.user_id}`).emit('new_match', { message: 'New potential match for your lost item!', itemId: item.id });
            io.to(`user_${newItem.user_id}`).emit('new_match', { message: 'Your found item might match a lost item!', itemId: newItem.id });
          }
        }
      }
    }
  } catch (error) {
    console.error('Auto match failed', error);
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  getMyItems,
  claimItem,
  deleteItem
};
