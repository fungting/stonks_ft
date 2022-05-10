import env from "./env";

export default {
    jwtSecret: env.SECRET,
    jwtSession: {
        session: false
    }
}