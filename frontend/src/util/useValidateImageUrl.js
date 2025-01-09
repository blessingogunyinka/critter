import { useEffect, useState } from "react" ; 

export default function useValidateImageUrl(imageUrl) {

    const [isValid, setIsValid] = useState(null) ; 

    useEffect(() => {

        async function isImageValid() {

            if (!imageUrl) {
                setIsValid(false) ; 
                return ; 
            }

            try {
                const response = await fetch(imageUrl) ; 

                if (response.status === 200) {
                    setIsValid(true) ; 
                    return ; 
                } else {
                    setIsValid(false) ; 
                    return ; 
                }
            } catch (error) {
                console.log(error) ; 
                setIsValid(false) ;
            }
        }

        isImageValid() ; 
        
    }, []) ; 

    return isValid ; 

}