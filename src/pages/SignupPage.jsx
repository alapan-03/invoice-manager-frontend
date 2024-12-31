import { useState } from "react";
import Signup from "../Components/Authentication/Signup/Signup";

export default function SignupPage(props) {

    const [id, setId] = useState(null)

    function getId(e){
        // setId(e)
        // props.uId(e)
        // console.log(e)
    }

    return (
        <>
        <Signup userId={getId}/>
        </>
    )
}