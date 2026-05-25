/**
 * authService.js
 *
 * Mock Authentication Service
 * Uses localStorage instead of backend APIs
 */

// ==========================================
// LOCAL STORAGE KEYS
// ==========================================

const USERS_KEY =
    "divulgeai_users"

const USER_KEY =
    "divulgeai_user"

const TOKEN_KEY =
    "divulgeai_token"

// ==========================================
// GET USERS
// ==========================================

function getStoredUsers() {

    try {

        return JSON.parse(

            localStorage.getItem(
                USERS_KEY
            )

        ) || []

    }

    catch {

        return []
    }
}

// ==========================================
// SAVE USERS
// ==========================================

function saveStoredUsers(users) {

    localStorage.setItem(

        USERS_KEY,

        JSON.stringify(users)
    )
}

// ==========================================
// GENERATE TOKEN
// ==========================================

function generateToken() {

    return (

        "tok_" +

        Math.random()
            .toString(36)
            .slice(2) +

        Date.now()
    )
}

// ==========================================
// REGISTER USER
// ==========================================

export async function registerUser(
    payload
) {

    const users =
        getStoredUsers()

    // ======================================
    // CHECK EXISTING EMAIL
    // ======================================

    const exists = users.find(

        user =>

            user.email ===
            payload.email
    )

    if (exists) {

        throw new Error(
            "An account with this email already exists."
        )
    }

    // ======================================
    // CREATE USER
    // ======================================

    const user = {

        id:
            "usr_" + Date.now(),

        name:
            payload.name,

        email:
            payload.email,

        clinic:
            payload.clinic || "",

        role:
            "dentist",

        joinedAt:
            new Date().toISOString(),

        avatar:
            null,

        password:
            payload.password
    }

    // ======================================
    // SAVE USER
    // ======================================

    users.push(user)

    saveStoredUsers(users)

    // ======================================
    // CREATE TOKEN
    // ======================================

    const token =
        generateToken()

    // ======================================
    // SAVE SESSION
    // ======================================

    localStorage.setItem(

        USER_KEY,

        JSON.stringify(user)
    )

    localStorage.setItem(

        TOKEN_KEY,

        token
    )

    // ======================================
    // RETURN USER
    // ======================================

    return {

        user,

        token
    }
}

// ==========================================
// LOGIN USER
// ==========================================

export async function loginUser(
    payload
) {

    const users =
        getStoredUsers()

    // ======================================
    // FIND USER
    // ======================================

    const user = users.find(

        user =>

            user.email ===
            payload.email &&

            user.password ===
            payload.password
    )

    // ======================================
    // INVALID LOGIN
    // ======================================

    if (!user) {

        throw new Error(
            "Invalid email or password."
        )
    }

    // ======================================
    // GENERATE TOKEN
    // ======================================

    const token =
        generateToken()

    // ======================================
    // SAVE SESSION
    // ======================================

    localStorage.setItem(

        USER_KEY,

        JSON.stringify(user)
    )

    localStorage.setItem(

        TOKEN_KEY,

        token
    )

    // ======================================
    // RETURN USER
    // ======================================

    return {

        user,

        token
    }
}

// ==========================================
// GET CURRENT USER
// ==========================================

export async function getMe() {

    const rawUser =

        localStorage.getItem(
            USER_KEY
        )

    if (!rawUser) {

        throw new Error(
            "Not authenticated"
        )
    }

    return {

        user:
            JSON.parse(rawUser)
    }
}

// ==========================================
// LOGOUT USER
// ==========================================

export async function logoutUser() {

    localStorage.removeItem(
        USER_KEY
    )

    localStorage.removeItem(
        TOKEN_KEY
    )
}

// ==========================================
// FORGOT PASSWORD
// ==========================================

export async function forgotPassword(
    payload
) {

    return {

        message:
            "Password reset link sent to your email."
    }
}