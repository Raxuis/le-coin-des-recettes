import {getServerSession} from "#auth";

export const checkUserSession = async (e:any) => {
    const session = await getServerSession(e);

    return !(!session || !session.user);
}