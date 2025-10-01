import agentService from "../services/agentService.js";

// Admin: list all agents
export const getAgents = async (req, res) => {
  try {
    const agents = await agentService.listAgents();
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: create new agent
export const createAgent = async (req, res) => {
  try {
    const agent = await agentService.createAgent(req.body);
    res.status(201).json(agent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: assign agent to a policy
export const assignAgent = async (req, res) => {
  try {
    const { agentId } = req.body;
    const updatedPolicy = await agentService.assignAgentToPolicy(agentId, req.params.id);
    res.json(updatedPolicy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
