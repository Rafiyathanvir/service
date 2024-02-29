
export async function returnRes(res, isSuccess, msg, result, port = 200) {
    return res.status(port).json({ isSuccess: isSuccess, message: msg, result: result });
}



