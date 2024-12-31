import { useState } from "react";
import Signup from "../Components/Authentication/Signup/Signup";
import Signin from "../Components/Authentication/Signin/Signin";

export default function SigninPage(props) {

    const [id, setId] = useState(null)

    function getId(e){
        // setId(e)
        props.uId(e)
        // console.log(e)
    }

    return (
        <>
        <Signin userId={getId}/>
        </>
    )
}