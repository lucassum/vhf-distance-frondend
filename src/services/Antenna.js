import axios from "axios";
const service = axios.create({
    baseURL: "https://hidden-stream-59258.herokuapp.com",
});

export const createAntenna = (antenna) => {
    return service
        .post('/', antenna)
        .then(({ data }) => data)
        .catch((err) => err);
};

export const getAntennas = () => {
    return service
        .get('/')
        .then(({ data }) => data)
        .catch((err) => err);
};

export const eraseAll = () => {
    return service
        .delete('/')
        .then(({ data }) => data)
        .catch((err) => err);
};