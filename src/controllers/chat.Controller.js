const {generateToken}=require('../config/streamChat');

exports.getStreamToken=async (req, res) => {
    const {id}=req.user;
    try {
        const token=await generateToken(id);
        res.status(200).json({token});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal server error"});
    }
}
