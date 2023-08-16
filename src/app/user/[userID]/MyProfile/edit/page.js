"use client"
import { useState, useEffect, useRef, useLayoutEffect } from "react"
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Page = ({ params }) => {
    const router = useRouter();
    const { userID } = params;
    const [user, setUser] = useState(null);
    let search = useSearchParams().get('attr');
    const [attr, setAttr] = useState("");
    const formRef = useRef(null);

    const getUserDetails = async () => {
        console.log("3");
        try {
            const res = await fetch(`/api/user/${userID}`, {
                method: "GET",

            });
            const { user } = await res.json();
            setUser(user);
            console.log(user);
        } catch (err) {
            console.log(err);
        }
    }

    //fetch user details
    useEffect(() => {
        console.log("2");
        getUserDetails();
        setAttr(search);
    }, []);


    //set scroll on form
    useEffect(() => {
        if (formRef.current) {
            console.log("formRef.current: ", formRef.current);
            const targetElement = formRef.current.querySelector(`#${attr}`);
            console.log("target element: ", targetElement);
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, [user, attr])


    //event handlers for edit form
    const handleInput = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }
    const handleExperienceInput = (event, idx) => {
        const exp = user.experiences;
        exp[idx][event.target.name] = event.target.value;
        setUser({ ...user, experiences: exp });
    }
    const handleEducationInput = (event, idx) => {
        const edu = user.educations;
        edu[idx][event.target.name] = event.target.value;
        setUser({ ...user, educations: edu });
    }
    const handleSkillInput = (event, idx) => {
        const skills = user.skills;
        skills[idx][event.target.name] = event.target.value;
        setUser({ ...user, skills: skills });
    }
    const handleCertificationInput = (event, idx) => {
        const certifications = user.certifications;
        certifications[idx][event.target.name] = event.target.value;
        setUser({ ...user, certifications: certifications });
    }

    const addNewExperience = () => {
        console.log("new experience called");
        const length = user.experiences.length;
        console.log("length: ", length);
        const newExperience = { start: '', end: '', role: '', type: '', duration: '', organisation: "" };
        search = `experience-${length}`;
        setAttr(search);
        console.log(search);
        setUser({ ...user, experiences: [...user.experiences, newExperience] });

    }
    const removeExperience = (idx) => {
        const updatedExperiences = user.experiences;
        updatedExperiences.splice(idx, 1);
        console.log("idx: ", idx);
        setAttr("experiences")
        setUser({ ...user, experiences: updatedExperiences });
    }
    const addNewEducation = () => {
        const newEducations = user.educations;
        const length = user.educations.length;
        newEducations.push({ start: '', end: '', institute: '', description: '', degree: '' });
        search = `education-${length}`;
        setAttr(search);
        setUser({ ...user, educations: newEducations });
    }
    const removeEducation = (idx) => {
        const updatedEducations = user.educations;
        updatedEducations.splice(idx, 1);
        setAttr("educations")
        setUser({ ...user, educations: updatedEducations });
    }

    const addNewSkill = () => {
        const newSkills = user.skills;
        const length = user.skills.length;
        newSkills.push({ name: '' });
        search = `skill-${length}`;
        setAttr(search);
        setUser({ ...user, skills: newSkills });
    }
    const removeSkill = (idx) => {
        const updatedSkills = user.skills;
        updatedSkills.splice(idx, 1);
        setAttr("skills")
        setUser({ ...user, skills: updatedSkills });
    }

    const addNewCertification = () => {
        const newCertifications = user.certifications;
        const length = user.certifications.length;
        newCertifications.push({ skill: '', providedBy: '' });
        search = `certification-${length}`;
        setAttr(search);
        setUser({ ...user, certifications: newCertifications });
    }
    const removeCertification = (idx) => {
        const updatedCertifications = user.certifications;
        updatedCertifications.splice(idx, 1);
        setAttr("certifications")
        setUser({ ...user, certifications: updatedCertifications });
    }

    const formSubmit = async (e) => {
        e.preventDefault();
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
            const { message, status } = await res.json();
            if (status == "true") {
                toast.success(message, {
                    position: "top-center"
                })
            }
            else {
                toast.error(message, {
                    position: "top-center"
                })
            }
            router.push(`/user/${userID}/MyProfile`)
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="absolute top-0 w-full bg-white">
            <div className="outline outline-2 outline-gray-200 my-20 mx-auto -2/3 sm:w-1/2 bg-stone-50 p-8 rounded-2xl">
                {user &&
                    <form ref={formRef} className="mx-auto " action="#" method="POST">
                        {console.log("form created")}
                        <div id="email" className="border-b-2 border-gray-200 py-8">
                            <label htmlFor="email" className="font-bold block text-base leading-6 text-gray-900">
                                Email Address:
                            </label>
                            <div className="mt-2">
                                <input
                                    onChange={handleInput}
                                    value={user.email}

                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div id="name" className="border-b-2 border-gray-200 py-8">
                            <label htmlFor="name" className="block text-base font-bold leading-6 text-gray-900">
                                Full Name:
                            </label>
                            <div className="mt-2">
                                <input
                                    onChange={handleInput}
                                    value={user.name}

                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="border-b-2 border-gray-200 py-8">
                            <label id="phone" htmlFor="phone" className="block text-base font-bold leading-6 text-gray-900">
                                Phone No.:
                            </label>
                            <div className="mt-2">
                                <input
                                    onChange={handleInput}
                                    value={user.phone}

                                    name="phone"
                                    type="text"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="border-b-2 border-gray-200 py-8">
                            <label id="about" htmlFor="about" className="block text-base font-bold leading-6 text-gray-900">
                                About:
                            </label>
                            <div className="mt-2">
                                <input

                                    onChange={handleInput}
                                    value={user.about}

                                    name="about"
                                    type="text"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div id="professionalDetails" className="border-b-2 border-gray-200 py-8">
                            <label htmlFor="professionalDetails" className="block text-base font-bold leading-6 text-gray-900">
                                Professional Details
                            </label>
                            <div className="mt-2">
                                <input

                                    onChange={handleInput}
                                    value={user.professionalDetails}

                                    name="professionalDetails"
                                    type="text"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div id="experiences" className="border-b-2 border-gray-200 py-8">
                            <label className="block text-base font-bold leading-6 text-gray-900">
                                Experiences:
                            </label>
                            <div className="mt-2">
                                {user.experiences && user.experiences.map((exp, idx) => {
                                    return (
                                        <div key={idx} id={`experience-${idx}`} className="my-12">
                                            <button className="float-right p-4 text-red-500 hover:underline decoration-inherit " onClick={() => removeExperience(idx)}>
                                                Remove
                                            </button>
                                            <div id={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="">
                                                    <label htmlFor={`experience-start-${idx}`} className="block font-semibold text-sm">
                                                        Start:
                                                    </label>
                                                    <input
                                                        onChange={(e) => handleExperienceInput(e, idx)}
                                                        value={exp.start}
                                                        id={`experience-start-${idx}`}
                                                        name="start"
                                                        type="text"
                                                        required
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                                <div className="">
                                                    <label htmlFor={`experience-start-${idx}`} className="block font-semibold text-sm">
                                                        End:
                                                    </label>
                                                    <input
                                                        onChange={(e) => handleExperienceInput(e, idx)}
                                                        value={exp.end}
                                                        id={`experience-end-${idx}`}
                                                        name="end"
                                                        type="text"
                                                        required
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                                <div className="">
                                                    <label htmlFor={`experience-start-${idx}`} className="block font-semibold text-sm">
                                                        Duration:
                                                    </label>
                                                    <input
                                                        onChange={(e) => handleExperienceInput(e, idx)}
                                                        value={exp.duration}
                                                        id={`experience-duration-${idx}`}
                                                        name="duration"
                                                        type="text"
                                                        required
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                                <div className="">
                                                    <label htmlFor={`experience-start-${idx}`} className="block font-semibold text-sm">
                                                        Type:
                                                    </label>
                                                    <input
                                                        onChange={(e) => handleExperienceInput(e, idx)}
                                                        value={exp.type}
                                                        id={`experience-type-${idx}`}
                                                        name="type"
                                                        type="text"
                                                        required
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                                <div className="">
                                                    <label htmlFor={`experience-organisation-${idx}`} className="block font-semibold text-sm">
                                                        Organisation:
                                                    </label>
                                                    <input
                                                        onChange={(e) => handleExperienceInput(e, idx)}
                                                        value={exp.organisation}
                                                        id={`experience-organisation-${idx}`}
                                                        name="organisation"
                                                        type="text"
                                                        required
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                                <div className="">
                                                    <label htmlFor={`experience-role-${idx}`} className="block font-semibold text-sm">
                                                        Role:
                                                    </label>
                                                    <input
                                                        onChange={(e) => handleExperienceInput(e, idx)}
                                                        value={exp.role}
                                                        id={`experience-role-${idx}`}
                                                        name="role"
                                                        type="text"
                                                        required
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                            <button onClick={addNewExperience} className="float-right text-purple-800 hover:underline decoration-inherit">
                                +Add new
                            </button>
                        </div>



                        <div id="educations" className="border-b-2 border-gray-200 py-8">
                            <label className="block text-base font-bold leading-6 text-gray-900">
                                Educations:
                            </label>
                            <div className="mt-2">
                                {user.educations && user.educations.map((edu, idx) => {
                                    return (
                                        <div key={idx} id={`education-${idx}`} className="my-12">
                                            <button className="float-right text-red-500 hover:underline decoration-inherit" onClick={() => { removeEducation(idx) }} >Remove</button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="">
                                                    <label htmlFor={`education-start-${idx}`} className="block font-semibold text-sm">
                                                        Start:
                                                    </label>
                                                    <input
                                                        onChange={(e) => handleEducationInput(e, idx)}
                                                        value={edu.start}
                                                        id={`education-start-${idx}`}
                                                        name="start"
                                                        type="text"
                                                        required
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                                <div className="">
                                                    <label htmlFor={`education-end-${idx}`} className="block font-semibold text-sm">
                                                        End:
                                                    </label>
                                                    <input
                                                        onChange={(e) => handleEducationInput(e, idx)}
                                                        value={edu.end}
                                                        id={`education-end-${idx}`}
                                                        name="end"
                                                        type="text"
                                                        required
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                                <div className="">
                                                    <label htmlFor={`education-degree-${idx}`} className="block font-semibold text-sm">
                                                        Degree:
                                                    </label>
                                                    <input
                                                        onChange={(e) => handleEducationInput(e, idx)}
                                                        value={edu.degree}
                                                        id={`education-degree-${idx}`}
                                                        name="degree"
                                                        type="text"
                                                        required
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                                <div className="">
                                                    <label htmlFor={`education-institute-${idx}`} className="block font-semibold text-sm">
                                                        Institute:
                                                    </label>
                                                    <input
                                                        onChange={(e) => handleEducationInput(e, idx)}
                                                        value={edu.institute}
                                                        id={`education-institute-${idx}`}
                                                        name="institute"
                                                        type="text"
                                                        required
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                                <div className=" md:col-span-2">
                                                    <label htmlFor={`education-description-${idx}`} className="block font-semibold text-sm">
                                                        Description:
                                                    </label>
                                                    <input
                                                        onChange={(e) => handleEducationInput(e, idx)}
                                                        value={edu.description}
                                                        id={`education-description-${idx}`}
                                                        name="description"
                                                        type="text"
                                                        required
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>


                                            </div>
                                        </div>

                                    )
                                })

                                }
                            </div>
                            <div>
                                <button onClick={addNewEducation} className="float-right text-purple-800 hover:underline decoration-inherit">+Add new</button>
                            </div>
                        </div>
                        <div id="skills" className="border-b-2 border-gray-200 py-8">
                            <label className="block text-base font-bold leading-6 text-gray-900">
                                Skills:
                            </label>
                            <div className="mt-2">
                                {user.skills && user.skills.map((skill, idx) => {
                                    return (
                                        <div key={idx} id={`skill-${idx}`} className="my-8">
                                            <button className="float-right text-red-500 hover:underline decoration-inherit" onClick={() => { removeSkill(idx) }} >Remove</button>
                                            <div className="w-1/3 my-4">
                                                <div className="">
                                                    <label htmlFor={`skill-name-${idx}`} className=" font-semibold text-sm">
                                                        Name:
                                                    </label>
                                                    <input
                                                        onChange={(e) => handleSkillInput(e, idx)}
                                                        value={skill.name}
                                                        id={`skill-name-${idx}`}
                                                        name="name"
                                                        type="text"
                                                        required
                                                        className=" w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                }
                            </div>
                            <div>
                                <button onClick={addNewSkill} className="float-right text-purple-800 hover:underline decoration-inherit">+Add new</button>
                            </div>
                        </div>
                        <div id="certifications" className="border-b-2 border-gray-200 py-8">
                            <label className="block text-base font-bold leading-6 text-gray-900">
                                Certifications:
                            </label>
                            <div className="mt-2">
                                {user.certifications && user.certifications.map((certification, idx) => {
                                    return (
                                        <div key={idx} id={`certification-${idx}`} className="my-12">
                                            <button className="float-right text-red-500 hover:underline decoration-inherit" onClick={() => { removeCertification(idx) }} >Remove</button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-1 gap-4">
                                                <div className="">
                                                    <label htmlFor={`certification-skill-${idx}`} className="block font-semibold text-sm">
                                                        Skill:
                                                    </label>
                                                    <input
                                                        onChange={(e) => handleCertificationInput(e, idx)}
                                                        value={certification.skill}
                                                        id={`certification-skill-${idx}`}
                                                        name="skill"
                                                        type="text"
                                                        required
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                                <div className="">
                                                    <label htmlFor={`certification-by-${idx}`} className="block font-semibold text-sm">
                                                        Provided By:
                                                    </label>
                                                    <input
                                                        onChange={(e) => handleCertificationInput(e, idx)}
                                                        value={certification.providedBy}
                                                        id={`certification-by-${idx}`}
                                                        name="providedBy"
                                                        type="text"
                                                        required
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                }
                            </div>
                            <div>
                                <button onClick={addNewCertification} className="float-right text-purple-800 hover:underline decoration-inherit">+Add new</button>
                            </div>
                        </div>

                        <div className="fixed top-1/3 right-8 md:right-24 lg:right-44">
                            <button
                                type="submit"
                                onClick={formSubmit}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                }
            </div>
        </div>
    )
}

export default Page