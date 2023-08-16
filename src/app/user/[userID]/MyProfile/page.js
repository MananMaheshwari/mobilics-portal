"use client"

import Link from "next/link"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


const Page = ({ params }) => {
    console.log("My Profile page")
    const router = useRouter();
    const { userID } = params;
    console.log(userID);
    const [user, setUser] = useState(null);
    const [upload, setUpload] = useState(false);

    const getUserDetails = async () => {
        try {
            const res = await fetch(`/api/user/${userID}`, {
                method: "GET",
            });
            const { user } = await res.json();
            setUser(user);
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        getUserDetails();
    }, [])

    const preset_key = "mobilics_assignment";
    const cloud_name = "dvuszgqmk";

    //function to upload photo to cloudinary
    const handleFile = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', preset_key);
        formData.append('cloud_name', cloud_name)
        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            //data.secure_url

            setUser({ ...user, photo: data.secure_url });
            setUpload(true);
        } catch (err) {
            console.log("error posting image: ", err);
        }
    }

    //function to upload photo to database
    const uploadPhoto = async () => {
        try {
            const res = await fetch(`/api/user/${userID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user
                })
            });
            const { status } = await res.json();
            alert("Uploaded successfully");

            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (upload === true) {
            uploadPhoto();
        }
        console.log("upload value: ", upload);
    }, [upload]);

    return (
        <div className="w-full bg-slate-200 h-fit">
            <div className='relative w-full my-2 rounded-md h-28 p-1 z-10 bg-violet-950 text-white'>
                <h4>My Profile</h4>
            </div>
            {console.log("user value on profile: ", user)}
            {user && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative top-[-4rem]  mx-10 rounded-md w-6/7 z-20 bg-white shadow-lg shadow-gray-500/50 ">
                {/* <div className="w-1/2 p-5">
                    <div className="m-5 rounded-sm outline outline-2 outline-offset-0 outline-gray-400 rounded-sm p-5"> 
                    <img
                        className="h-16 w-16 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </div>
                    <div className="m-5 rounded-sm outline outline-2 outline-offset-0 outline-gray-400 rounded-sm p-5">
                        <p>Your Name:</p>
                        <p>{user.name}<span className="float-right"><Link href="#">Edit</Link></span></p>
                        <p>Email: </p>
                        <p>{user.email}<span className="float-right"><Link href="#">Edit</Link></span></p>
                        <p>Phone Number:</p>
                        <p>{user.phone}<span className="float-right"><Link href="#">Edit</Link></span></p>
                    </div>
                    <div className="m-5 rounded-sm outline outline-2 outline-offset-0 outline-gray-400 rounded-sm p-5">
                        <p>About <span className="float-right"><Link href="#">Edit</Link></span></p>
                        <p>{user.about}</p>
                    </div>
                    <div className="m-5 rounded-sm outline outline-2 outline-offset-0 outline-gray-400 rounded-sm p-5">
                        <p>Skills <span className="float-right"><Link href="#">Edit</Link></span></p>
                        {user.skills.map((skill)=>{
                            return(
                                <p>{skill.name}</p>
                            )
                        })}
                    </div>
                </div>
                <div className="w-1/2 p-5">
                    <div className="m-5 rounded-sm outline outline-2 outline-offset-0 outline-gray-400 rounded-sm p-5">
                        <p>Professional Details <span className="float-right"><Link href="#">Edit</Link></span></p>
                        <p>{user.professionalDetails}</p>
                    </div>
                    <div className="m-5 p-5" >
                        <p>Certifications <span className="float-right"><Link href="#">Edit</Link></span></p>
                        {user.certifications.map((certification)=>{
                            return(
                                <div className="rounded-full outline outline-2 outline-offset-0 outline-gray-400 p-5">
                                    <p>{certification.skill}</p>
                                    <p>{certification.providedBy}</p>
                                </div>
                            )
                        })}

                    </div>
                    <div className="m-5 p-5">
                        <p>Experiences <span className="float-right"><Link href="#">Edit</Link></span></p>
                        {user.experiences.map((experience)=>{
                            return (
                                <div className="flex rounded-sm outline outline-2 outline-offset-0 outline-gray-400 rounded-sm p-5">
                                    <div className="w-1/2">
                                        <p>{experience.duration} ( {experience.start}-{experience.end} ) </p>
                                        <p>{experience.organisation}</p>
                                    </div>
                                    <div className="w-1/2">
                                        <p>{experience.type}</p>
                                        <p>--{experience.role}--</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="p-5 m-5 ">
                        <p>Education <span className="float-right"><Link href="#">Edit</Link></span></p>
                        {user.educations.map((education)=>{
                            return (
                                <div className="rounded-sm outline outline-2 outline-offset-0 outline-gray-400 rounded-sm p-5">
                                    <p>{education.institute}</p>
                                    <p><span>({education.start}-{education.end})</span ><span className="float-right">{education.degree}</span></p>
                                    <p>{education.description}</p>                                
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div> */}
                <div className="grid grid-cols-2 m-5 p-5">
                    <img
                        className="h-32 w-32 rounded-full"
                        src={user.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                        alt="profile-image-user"
                    />
                    <form className="w-full mx-auto my-auto text-right">
                        <label className="cursor-pointer px-3 py-1 rounded-full bg-gray-400 font-bold right-0" for="files" >Upload</label>
                        <input type="file" id="files" style={{ visibility: "hidden" }} onChange={handleFile} />
                    </form>
                </div>
                <div className="m-5 rounded-sm outline outline-2 outline-offset-0 outline-gray-400 rounded-sm p-5">
                    <p className="font-bold">Skills <span className=" float-right"><Link className="px-3 py-1 rounded-full bg-gray-400" href="MyProfile/edit?attr=skills">Edit</Link></span></p>
                    <ul className="list-disc">
                        {user.skills.map((skill, idx) => {
                            return (
                                <li key={idx} className="">{skill.name}</li>
                            )
                        })}
                    </ul>
                </div>

                <div className="my-auto m-5 rounded-sm outline outline-2 outline-offset-0 outline-gray-400 rounded-sm p-5">
                    <p className="font-bold">Your Name: <span className="float-right"><Link className="px-3 py-1 rounded-full bg-gray-400" href="MyProfile/edit?attr=name">Edit</Link></span></p>
                    <p>{user.name}</p>
                    <p className="font-bold">Email: <span className="float-right"><Link className="px-3 py-1 rounded-full bg-gray-400" href="MyProfile/edit?attr=email">Edit</Link></span></p>
                    <p>{user.email}</p>
                    <p className="font-bold">Phone Number: <span className="float-right"><Link className="px-3 py-1 rounded-full bg-gray-400" href="MyProfile/edit?attr=phone">Edit</Link></span></p>
                    <p>{user.phone}</p>
                </div>
                <div className="m-5" >
                    <p className="font-bold">Certifications <span className="float-right"><Link className="px-3 py-1 rounded-full bg-gray-400" href="MyProfile/edit?attr=certifications">Edit</Link></span></p>
                    {user.certifications.map((certification, idx) => {
                        return (
                            <div key={idx} className="text-center rounded-full outline outline-2 outline-offset-0 outline-gray-400 p-5 m-2">
                                <img className="absolute h-16 w-16" src="https://static.vecteezy.com/system/resources/previews/019/953/584/original/yellow-and-white-star-badge-award-icon-free-png.png" alt="star pic" />
                                <p>{certification.skill}</p>
                                <p>{certification.providedBy}</p>
                            </div>
                        )
                    })}

                </div>
                <div className="m-5 rounded-sm outline outline-2 outline-offset-0 outline-gray-400 rounded-sm p-5">
                    <p className="font-bold">About <span className="float-right"><Link className="px-3 py-1 rounded-full bg-gray-400" href="MyProfile/edit?attr=about">Edit</Link></span></p>
                    <p>{user.about}</p>
                </div>
                <div className="m-5 rounded-sm outline outline-2 outline-offset-0 outline-gray-400 rounded-sm p-5">
                    <p className="font-bold">Professional Details <span className="float-right"><Link className="px-3 py-1 rounded-full bg-gray-400" href="MyProfile/edit?attr=professionalDetails">Edit</Link></span></p>
                    <p>{user.professionalDetails}</p>
                </div>


                <div className="m-5">
                    <p className="font-bold">Experiences <span className="float-right"><Link className="px-3 py-1 rounded-full bg-gray-400" href="MyProfile/edit?attr=experiences">Edit</Link></span></p>
                    {user.experiences.map((experience, idx) => {
                        return (
                            <div key={idx} className="flex rounded-sm outline outline-2 outline-offset-0 outline-gray-400 rounded-sm p-5 m-2">
                                <div className="w-1/2">
                                    <p className="font-bold">{experience.duration} ( {experience.start}-{experience.end} ) </p>
                                    <p>{experience.organisation}</p>
                                </div>
                                <div className="w-1/2">
                                    <p className="font-bold">{experience.type}</p>
                                    <p>--{experience.role}--</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="m-5 ">
                    <p className="font-bold">Educations <span className="float-right"><Link className="px-3 py-1 rounded-full bg-gray-400" href="MyProfile/edit?attr=educations">Edit</Link></span></p>
                    {user.educations.map((education, idx) => {
                        return (
                            <div key={idx} className="rounded-sm outline outline-2 outline-offset-0 outline-gray-400 rounded-sm p-5 m-2">
                                <p className="font-bold text-violet-950">{education.institute}</p>
                                <p className="font-bold"><span>({education.start}-{education.end})</span ><span className="float-right">{education.degree}</span></p>
                                <p>{education.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>}
        </div>
    )
}

export default Page