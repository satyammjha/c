import axios from "axios"

const consumeCredit = async (action, email) => {
    console.log("Consume Credit Function Called", action, email)
    try {
        const response = await axios.post("http://localhost:5000/credit", {
            email: email,
            action: action
        });
        return response;

    }
    catch (e) {
        return e;
    }
}

export default consumeCredit;