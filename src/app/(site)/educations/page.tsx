"use client"

import React, { useEffect, useState, useMemo } from "react"
import { ChipButton } from "@/components/ui/Button/LinkChipButton"
import useAuth from "@/hooks/useAuth"
import { RegionData } from "@/lib/regions"
import { fetchProfile, fetchUserLesson } from "@/app/Api"
import EducationContainer from "@/components/ui/Education/EducationContainer"
import RegionSelect from "@/components/common/RegionSelect"
import EducationSearchForm from "@/components/ui/Education/EducationSearchForm"
import MajorSelect from "@/components/common/MajorSelect"
import LocationTag from "@/components/common/LocationTag"
import FilterTag from "@/components/common/FilterTag"
import { useRouter } from "next/navigation"

const page = () => {
  const [isTeacher, setIsTeacher] = useState<boolean>(false)
  const [userLessonId, setUserLessonId] = useState<number>()
  const [isRegionSelect, setIsRegionSelect] = useState(false)
  const [isMajorSelect, setIsMajorSelect] = useState(false)
  const [selectedMajor, setSelectedMajor] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedRegionList, setSelectedRegionList] = useState<string[]>([])
  const [selectedMajorList, setSelectedMajorList] = useState<string[]>([])
  const [selectedRegionStep, setSelectedRegionStep] = useState(1)
  const router = useRouter()

  useEffect(() => {
    console.log("selectedRegionList", selectedRegionList)
    console.log("selectedMajorList", selectedMajorList)
  }, [selectedRegionList, selectedMajorList])

  const handleRegionModal = () => {
    setIsRegionSelect(!isRegionSelect)
  }

  const handleMajorModal = () => {
    setIsMajorSelect(!isMajorSelect)
  }

  const handleSelectCity = (region: string) => {
    setSelectedCity(region)
    setIsRegionSelect(!isRegionSelect)
    // setSelectedRegionStep(2)
  }

  const handleSelectDistrict = (district: string) => {
    setSelectedDistrict(district)
    setIsRegionSelect(false)
  }

  const deleteRegion = (index: number) => {
    setSelectedRegionList(selectedRegionList.filter((_, i) => i !== index))
  }

  const deleteMajor = (index: number) => {
    setSelectedMajorList(selectedMajorList.filter((_, i) => i !== index))
  }

  const handleRegionList = () => {
    setSelectedRegionList([...selectedRegionList, selectedCity])
    setSelectedRegionStep(1)
  }

  const handleMajorList = () => {
    setSelectedMajorList([...selectedMajorList, selectedMajor])
  }

  const handleSelectMajor = (major: string) => {
    setSelectedMajor(major)
    setIsMajorSelect(false)
  }

  const districtList = useMemo(() => {
    if (selectedCity) {
      return RegionData[selectedCity]
    }
    return null
  }, [selectedCity])

  const { user } = useAuth()

  useEffect(() => {
    if (selectedCity) {
      handleRegionList()
    }
  }, [selectedCity])

  useEffect(() => {
    if (selectedMajor) {
      handleMajorList()
      setSelectedMajor("")
    }
  }, [selectedMajor])

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
        <div className="flex">
          <h2 className="text-2xl font-bold mb-4">레슨</h2>
          <EducationSearchForm
            handleRegionModal={handleRegionModal}
            handleMajorModal={handleMajorModal}
          />
        </div>

        {isTeacher ? (
          <ChipButton
            url={`/educations/${userLessonId}?type=update`}
            title="레슨수정"
          />
        ) : (
          <ChipButton url="/educations/create" title="레슨등록" />
        )}
      </div>
      <div className=" mb-2">
        <div className="flex mb-1">
          {selectedMajorList.map((major, index) => (
            <FilterTag
              key={major}
              tag={major}
              color="blue"
              index={index}
              deleteItem={deleteMajor}
            />
          ))}
        </div>
        <div className="flex overflow-x-autoflex">
          {selectedRegionList.map((region, index) => (
            <FilterTag
              key={region}
              tag={region}
              color="red"
              index={index}
              deleteItem={deleteRegion}
            />
          ))}
        </div>
      </div>
      {isRegionSelect && (
        <RegionSelect
          isOpen={isRegionSelect}
          selectedCity={selectedCity}
          closeModal={() => {
            setIsRegionSelect(false)
            setSelectedRegionStep(1)
          }}
          handleSelectCity={handleSelectCity}
          districtList={districtList}
          selectStep={selectedRegionStep}
          handleSelectDistrict={handleSelectDistrict}
        />
      )}
      {isMajorSelect && (
        <MajorSelect
          isOpen={isMajorSelect}
          closeModal={() => setIsMajorSelect(false)}
          handleSelectMajor={handleSelectMajor}
        />
      )}
      <EducationContainer
        selectedMajorList={selectedMajorList}
        selectedRegionList={selectedRegionList}
      />
    </div>
  )
}

export default page
