"use client"

import React, { Suspense, useEffect, useState } from "react"
import LessonSkeleton from "@/components/ui/Skeleton/LessonSkeleton"
import { ChipButton } from "@/components/ui/Button/LinkChipButton"
import useAuth from "@/hooks/useAuth"
import { fetchProfile, fetchUserLesson } from "@/app/Api"
import EducationContainer from "@/components/ui/Education/EducationContainer"

const page = () => {
  const [isTeacher, setIsTeacher] = useState<boolean>(false)
  const [userLessonId, setUserLessonId] = useState<number>()

  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchProfile(user.id)
        .then(res => setIsTeacher(res[0].is_teacher))
        .catch(err => {
          console.log(err)
        })
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchUserLesson(user.id)
        .then(res => setUserLessonId(res.id))
        .catch(err => {
          console.log("err", err)
        })
    }
  }, [isTeacher])

  return (
    <div className="sm:container mx-auto mt-4 px-4">
      <div className="flex justify-between mt-4">
        <h2 className="text-2xl font-bold mb-4">레슨</h2>
        {isTeacher ? (
          <ChipButton
            url={`/educations/${userLessonId}?type=update`}
            title="레슨수정"
          />
        ) : (
          <ChipButton url="/educations/create" title="레슨등록" />
        )}
      </div>
      <EducationContainer />
    </div>
  )
}

export default page
