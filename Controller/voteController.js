const Vote = require("..//Models/Vote");
const Project = require("../Models/Project");

const calculateEuclideanDistance = (pattern1, pattern2) => {
  if (pattern1.length !== pattern2.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < pattern1.length; i++) {
    sum += Math.pow(pattern1[i] - pattern2[i], 2);
  }
  return Math.sqrt(sum);
};

const FACE_MATCH_THRESHOLD = 0.5;

const submitVote = async (req, res) => {
  try {
    const { projectId, name, facialPattern } = req.body;

    // 1. Validate incoming data
    if (!projectId || !name || !facialPattern || !Array.isArray(facialPattern)) {
      return res.status(400).json({ message: "Missing required fields or invalid face data." });
    }

    // 2. Fetch the project to get the organizer's ID (uploadedBy)
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // 3. Extract the organizer's ID from your specific field
    const organizerId = project.uploadedBy;

    // 4. Fetch all votes associated with THIS organizer across ALL their projects
    const existingVotes = await Vote.find({ organizerId });

    // 5. Compare the new face against all existing faces for this organizer
    let hasVoted = false;

    for (const vote of existingVotes) {
      const distance = calculateEuclideanDistance(facialPattern, vote.facialPattern);
      
      if (distance < FACE_MATCH_THRESHOLD) {
        hasVoted = true;
        break; 
      }
    }

    // 6. Handle the result
    if (hasVoted) {
      return res.status(403).json({ 
        message: "You have already voted in a project hosted by this organizer!" 
      });
    }

    // 7. If no match is found, save the new vote
    const newVote = new Vote({
      projectId,
      organizerId, // Storing this avoids needing to query the Project model on every check later
      name,
      facialPattern,
    });

    await newVote.save();

    return res.status(201).json({ message: "Vote submitted successfully!" });

  } catch (error) {
    console.error("Error submitting vote:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  submitVote,
};