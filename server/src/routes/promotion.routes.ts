import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.ts';
import { broadcastPromotion } from '../services/promotion.socket.ts';

const router = Router();

router.post('/broadcast', requireAuth, (req, res) => {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  const discount = req.body?.discount;
  const expiresAt = typeof req.body?.expiresAt === 'string' ? req.body.expiresAt : undefined;

  if (!title || !message) {
    return res.status(400).json({ message: 'Title and message are required' });
  }

  if (discount !== undefined &&
      (!Number.isFinite(Number(discount)) || Number(discount) < 0 || Number(discount) > 100)) {
    return res.status(400).json({ message: 'Discount must be between 0 and 100' });
  }

  broadcastPromotion({
    title,
    message,
    discount: discount === undefined ? undefined : Number(discount),
    expiresAt
  });

  return res.status(202).json({ message: 'Promotion notification broadcast' });
});

export default router;
