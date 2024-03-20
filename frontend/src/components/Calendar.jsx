import React, { useState, useEffect } from "react"
import "./Calendar.scss" // Assurez-vous que le chemin vers votre fichier CSS est correct

export default function Calendar({ onDateSelect }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [calendarDays, setCalendarDays] = useState([])
  const [selectedDateCalendar, setselectedDateCalendar] = useState(null)
  console.info(
    "selectedDateCalendar in Calendar component",
    selectedDateCalendar
  )
  useEffect(() => {
    generateCalendarDays(selectedYear, selectedMonth)
  }, [selectedMonth, selectedYear])

  const leftArrowClick = () => {
    const newMonth = selectedMonth === 0 ? 11 : selectedMonth - 1
    const newYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear
    setSelectedMonth(newMonth)
    setSelectedYear(newYear)
  }

  const rightArrowClick = () => {
    const newMonth = selectedMonth === 11 ? 0 : selectedMonth + 1
    const newYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear
    setSelectedMonth(newMonth)
    setSelectedYear(newYear)
  }

  const monthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value))
  }

  const yearChange = (e) => {
    setSelectedYear(parseInt(e.target.value))
  }

  const generateCalendarDays = (year, month) => {
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfWeek = new Date(year, month, 1).getDay()
    const days = []

    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    for (let i = 1; i <= totalDaysInMonth; i++) {
      const currentDate = new Date(year, month, i)
      const isToday =
        currentDate.getDate() === today.getDate() &&
        currentDate.getMonth() === currentMonth &&
        currentDate.getFullYear() === currentYear
      days.push({ day: i, isToday, date: currentDate }) // Ajouter la propriété 'date'
    }

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.unshift({ day: null, isToday: false, date: null }) // Ajouter la propriété 'date' avec la valeur null
    }

    setCalendarDays(days)
  }

  const goToToday = () => {
    const today = new Date()
    setSelectedMonth(today.getMonth())
    setSelectedYear(today.getFullYear())
  }

  const handleDateClick = (date) => {
    if (date instanceof Date) {
      // Vérification si date est une instance de Date
      const adjustedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      ) // Ajuster la date pour le fuseau horaire local
      console.info("date du handleDateClick de Calendar coponet", adjustedDate)
      setselectedDateCalendar(adjustedDate.toISOString().split("T")[0]) // Formater la date au format "YYYY-MM-DD"
      onDateSelect(adjustedDate) // Passer la date ajustée
    }
  }

  return (
    <div className="calendar-container">
      <div className="calendar-month-arrow-container">
        <div className="calendar-month-year-container">
          <select
            className="calendar-years"
            onChange={yearChange}
            value={selectedYear}
          >
            {Array.from({ length: 121 }, (_, i) => (
              <option key={i} value={selectedYear - 60 + i}>
                {selectedYear - 60 + i}
              </option>
            ))}
          </select>
          <select
            className="calendar-months"
            onChange={monthChange}
            value={selectedMonth}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(2000, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
        <div className="calendar-arrow-container">
          <button className="calendar-today-button" onClick={goToToday}>
            Aujourd'hui
          </button>
          <button className="calendar-left-arrow" onClick={leftArrowClick}>
            ←
          </button>
          <button className="calendar-right-arrow" onClick={rightArrowClick}>
            →
          </button>
        </div>
      </div>
      <ul className="calendar-week">
        <li>Dim</li>
        <li>Lun</li>
        <li>Mar</li>
        <li>Mer</li>
        <li>Jeu</li>
        <li>Ven</li>
        <li>Sam</li>
      </ul>
      <ul className="calendar-days">
        {calendarDays.map((dayInfo, index) => (
          <li
            key={index}
            className={
              dayInfo.day
                ? "calendar-day" + (dayInfo.isToday ? " current-day" : "")
                : "calendar-day empty"
            }
            onClick={() => handleDateClick(dayInfo.date)}
          >
            {dayInfo.day}
          </li>
        ))}
      </ul>
    </div>
  )
}
