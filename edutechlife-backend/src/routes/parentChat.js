const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const parentChatService = require('../services/parentChatService');

const router = Router();

/**
 * GET /api/parent-chat/conversations
 * Get all conversations for authenticated parent
 */
router.get('/conversations', requireAuth, async (req, res) => {
  try {
    const parentId = req.userId;
    const { status = 'active', limit = 50 } = req.query;

    const conversations = await parentChatService.getParentConversations(parentId, {
      status,
      limit: Math.min(parseInt(limit) || 50, 100),
    });

    res.json({
      conversations,
      count: conversations.length,
    });
  } catch (e) {
    console.error('Error fetching conversations:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * POST /api/parent-chat/conversations
 * Create a new conversation or get existing one
 */
router.post('/conversations', requireAuth, async (req, res) => {
  try {
    const parentId = req.userId;
    const { studentId, title, topic } = req.body || {};

    if (!studentId) {
      return res.status(400).json({ error: 'studentId es requerido' });
    }

    // TODO: Verify parent-student link
    const { id, isNew } = await parentChatService.getOrCreateConversation(
      parentId,
      studentId,
      { title, topic: topic || 'progress' }
    );

    res.status(isNew ? 201 : 200).json({
      conversationId: id,
      isNew,
      message: isNew ? 'Conversación creada' : 'Conversación existente',
    });
  } catch (e) {
    console.error('Error creating/getting conversation:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/parent-chat/conversations/:conversationId
 * Get conversation history with messages
 */
router.get('/conversations/:conversationId', requireAuth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50 } = req.query;

    // TODO: Verify conversation ownership
    const history = await parentChatService.getConversationHistory(
      conversationId,
      Math.min(parseInt(limit) || 50, 100)
    );

    res.json({
      conversationId,
      messages: history,
      count: history.length,
    });
  } catch (e) {
    console.error('Error fetching conversation history:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * POST /api/parent-chat/conversations/:conversationId/messages
 * Send a message to Dani (from parent)
 */
router.post('/conversations/:conversationId/messages', requireAuth, async (req, res) => {
  try {
    const parentId = req.userId;
    const { conversationId } = req.params;
    const { message, contextData } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
    }

    if (message.length > 5000) {
      return res.status(400).json({ error: 'El mensaje excede el límite de 5000 caracteres' });
    }

    // TODO: Verify conversation ownership
    const result = await parentChatService.sendMessageToDani(
      parentId,
      conversationId,
      message.trim(),
      contextData
    );

    res.status(201).json({
      success: true,
      conversationId: result.conversationId,
      response: result.response,
    });
  } catch (e) {
    console.error('Error sending message to Dani:', e);
    if (e.message.includes('no encontrada')) {
      return res.status(404).json({ error: e.message });
    }
    res.status(500).json({ error: 'Error al generar respuesta' });
  }
});

/**
 * GET /api/parent-chat/conversations/:conversationId/summary
 * Get conversation summary
 */
router.get('/conversations/:conversationId/summary', requireAuth, async (req, res) => {
  try {
    const { conversationId } = req.params;

    // TODO: Verify conversation ownership
    const summary = await parentChatService.generateConversationSummary(conversationId);

    if (!summary) {
      return res.status(404).json({ error: 'No hay resumen disponible' });
    }

    res.json({
      conversationId,
      summary: summary.summary_text,
      keyTopics: summary.key_topics,
      generatedAt: summary.generated_at,
    });
  } catch (e) {
    console.error('Error generating summary:', e);
    res.status(500).json({ error: 'Error generando resumen' });
  }
});

/**
 * POST /api/parent-chat/conversations/:conversationId/archive
 * Archive a conversation
 */
router.post('/conversations/:conversationId/archive', requireAuth, async (req, res) => {
  try {
    const parentId = req.userId;
    const { conversationId } = req.params;

    // TODO: Update conversation status to archived
    // This is a placeholder for actual implementation
    res.json({
      success: true,
      conversationId,
      status: 'archived',
    });
  } catch (e) {
    console.error('Error archiving conversation:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/parent-chat/context/:studentId
 * Get context data for a student (for chat initialization)
 */
router.get('/context/:studentId', requireAuth, async (req, res) => {
  try {
    const parentId = req.userId;
    const { studentId } = req.params;

    // TODO: Verify parent-student link
    const context = await parentChatService.buildParentChatContext(studentId);

    res.json({ context });
  } catch (e) {
    console.error('Error building context:', e);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
