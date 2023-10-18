class ConversationsController {
    async getChatPage(req, res) {
      try {
        res.status(200).render('chat', {});
      } catch (err) {
        res.status(500).json({ Error: `${err}` });
      }
    }
  }
  
  export const conversationsController = new ConversationsController();
  