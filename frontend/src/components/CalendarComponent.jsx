// import React, { useState, useEffect } from "react"
import FullCalendar from "@fullcalendar/react" // Importation du composant principal
import dayGridPlugin from "@fullcalendar/daygrid" // Plugin pour la vue en grille quotidienne
import timeGridPlugin from "@fullcalendar/timegrid" // Plugin pour la vue en grille horaire
import interactionPlugin from "@fullcalendar/interaction" // Pour les interactions (clic, sélection)
import frLocale from "@fullcalendar/core/locales/fr" // Importation de la locale française

export default function CalendarComponent({ onDateClick, events }) {
  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth" // Vue initiale en grille mensuelle
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        locale={frLocale} // Définit la langue française
        dateClick={(info) => {
          // Appelé lorsqu'une date est cliquée
          onDateClick(info.date) // Passe la date sélectionnée au parent
        }}
        events={events} // Les événements à afficher
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true} // Affiche "plus" si trop d'événements
      />
    </div>
  )
}
