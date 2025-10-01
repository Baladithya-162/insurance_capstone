import User from "../models/User.js";
import UserPolicy from "../models/UserPolicy.js";

export const listAgents = async() => {
  return User.find({ role: "agent" }).select("-passwordHash");
}

export const createAgent = async ({ name, email, password }) => {
  const agent = new User({
    name,
    email,
    password,
    role: "agent",
  });
  await agent.save();
  return agent;
}

export const assignAgentToPolicy = async (agentId, policyId) =>{
  const userPolicy = await UserPolicy.findById(policyId);
  if (!userPolicy) throw new Error("Policy not found");

  userPolicy.assignedAgentId = agentId;
  await userPolicy.save();
  return userPolicy;
}

export default {
  listAgents,
  createAgent,
  assignAgentToPolicy,
};
