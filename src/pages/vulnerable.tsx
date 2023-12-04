import React from "react";

const VulnerablePage = () => {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = event.target;
        const username: string = data.username.value;
        if (/^\'.+/g.test(username)) {
            alert("Good")
        }else{
            console.log("nop");
            
        }

        
    }

    return (
        <main>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className="flex flex-col w-1/5">
                    <label htmlFor="username">Username:</label>
                    <input type="text" name="username" placeholder="Username" />
                </div>
                <button type="submit">Login</button>
            </form>
        </main>
    )
}

export default VulnerablePage;