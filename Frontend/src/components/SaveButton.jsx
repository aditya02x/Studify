import React from 'react'
import api from '../services/api.js'
import { useState } from 'react'
import { toast } from 'react-toastify';


const SaveButton = ({courseId}) => {
    const [saved, setSaved] = useState(false);

    const handelSave = async ()=>{
        try {
            const res = await api.post(`/auth/bookmark/${courseId}`)
            setSaved(res.data.success ? !saved: saved)
            toast.success(res.data.success ? "Course Bookmarked" : "Course Removed from Bookmarks")
        } catch (error) {
            console.log("Error in handelSave",error)
            toast.error("Error occurred while saving course")
        }
    }

    
  return (
   <button onClick={handelSave}>
   {saved ? "❤️ Saved" : "Save Course"}

   </button>
  )
}

export default SaveButton
