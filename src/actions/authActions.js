import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';

import { HOME_ROUTE,  ROOT_ROUTE, SESSION_COOKIE_NAME } from '../utils/constants';

export async function createSession(data) {

    return new Promise((res, rej) => {

        cookies().set({
            name: SESSION_COOKIE_NAME,
            value: data,
            maxAge: 60 * 60 * 24,
            httpOnly: true
        })

        res()

    })

//   redirect(HOME_ROUTE);
}


export async function createCookie(data, cookie_name) {
    return new Promise((res, rej) => {

        cookies().set({
            name: cookie_name,
            value: data,
            httpOnly: true
        })

        res()

    })

}

export async function removeSession() {
    return new Promise((res, rej) => {
        cookies().delete(SESSION_COOKIE_NAME);
        res()

    })
//   redirect(ROOT_ROUTE);
}