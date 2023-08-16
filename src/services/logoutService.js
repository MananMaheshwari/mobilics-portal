//logout function
export default async function logout() {
    console.log("logout is called");
    try {
        const res = await fetch('/api/logout', {
            method: "GET"
        })
        const response = await res.json();
        return response.message;

    } catch (err) {
        console.log(err);
    }
}