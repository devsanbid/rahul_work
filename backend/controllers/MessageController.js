import MessageReviews from '../models/MessageReviews.js';


export const CreateMessageReviews = async (request, response) => {
  const { projectId, comment } = request.body;
  console.log("messaging is sending......")

  if (!projectId || !comment) {
    return response.json({
      message: "Please put somethings",
      success: false

    })
  }

  try {

    console.log("here: messaging is sending......")
    await MessageReviews.create({
      projectId,
      comment
    })

    console.log("here: lagging is sending......")
    return response.json({
      message: "created successfuly",
      success: true
    })
  } catch (error) {
    return response.json({
      message: error,
      success: false
    })
  }
}

export const getMessageReviews = async (request, response) => {

  try {

    const allMessage = await MessageReviews.findAll()

    return response.json({
      message: "Successfuly fecthed",
      success: true,
      message: allMessage
    })
  } catch (error) {

  }
}



