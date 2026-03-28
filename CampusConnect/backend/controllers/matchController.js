const db = require('../config/db');

// @desc    Get matches for user
// @route   GET /api/matches
// @access  Private
const getMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    // Get all matches where the user owns either the lost or found item
    const query = `
      SELECT m.id as match_id, m.similarity_score, m.status,
             li.id as lost_item_id, li.title as lost_item_title, li.user_id as lost_user_id,
             fi.id as found_item_id, fi.title as found_item_title, fi.user_id as found_user_id
        FROM matches m
        JOIN items li ON m.lost_item_id = li.id
        JOIN items fi ON m.found_item_id = fi.id
       WHERE li.user_id = ? OR fi.user_id = ?
    `;

    const [matches] = await db.query(query, [userId, userId]);
    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching matches' });
  }
};

module.exports = { getMatches };
