import * as claimService from "../services/claimService.js";

export const submitClaim = async (req, res) => {
  try {
    if(!req.user){
      throw new Error("User not found")
    }
   const  {userPolicyId, incidentDate, description, amountClaimed } = req.body
    const claim = await claimService.submitClaim(req.user.userId,{userPolicyId, incidentDate, description, amountClaimed});
    res.status(201).json(claim);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listClaims = async (req, res) => {
  try {
    const claims = await claimService.listClaims(req.user);
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getClaim = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Claim ID is required" });
    }

    const claim = await claimService.getClaimById(req.user, id);
    res.json(claim);
  } catch (err) {
    // Use 403 only if it's actually an auth issue
    const statusCode =
      err.message === "Unauthorized" ? 403 :
      err.message === "Claim not found" ? 404 : 400;

    res.status(statusCode).json({ message: err.message });
  }
};

export const updateClaimStatus = async (req, res) => {
  try {
    const claim = await claimService.updateClaimStatus(req.user._id, req.params.id, req.body);
    res.json(claim);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
