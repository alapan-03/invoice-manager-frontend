// import React, { useState } from "react";
// import "./Cards.css";
// import useGetFromFirestore from "../../../app/Hooks/useGetFromFirestore";
// import { AuthProvider, useAuth } from "./../../../AuthProvider";
// import { CircleChevronRight } from "lucide-react";

// const Cards = () => {
//   const { user } = useAuth();
//   const { invoices } = useGetFromFirestore(user?.email);

//   const [searchTerm, setSearchTerm] = useState("");

//   const trimDescription = (description) => {
//     const words = description?.split(" ");
//     return words.length > 20
//       ? words.slice(0, 20).join(" ") + "..."
//       : description;
//   };

//   const groupByDate = (data) => {
//     return data.reduce((groups, invoice) => {
//       // Normalize the date by removing the time part
//       const date = new Date(Number(invoice.date));
//       const normalizedDate = new Date(
//         date.getFullYear(),
//         date.getMonth(),
//         date.getDate()
//       ).getTime();

//       if (!groups[normalizedDate]) {
//         groups[normalizedDate] = [];
//       }
//       groups[normalizedDate].push(invoice);
//       return groups;
//     }, {});
//   };

//   const groupedInvoices = groupByDate(
//     invoices?.filter(
//       (card) =>
//         card.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         card.description?.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   // Sort the grouped dates in descending order
//   const sortedDates = Object.keys(groupedInvoices).sort((a, b) => b - a); // Descending order

//   const formatDate = (timestamp) => {
//     const date = new Date(Number(timestamp)); // Convert timestamp to Date
//     const day = date.getDate();
//     const month = date.toLocaleString("default", { month: "long" });
//     const year = date.getFullYear();

//     // Add ordinal suffix to the day
//     const ordinalSuffix = (day) => {
//       if (day > 3 && day < 21) return "th";
//       switch (day % 10) {
//         case 1:
//           return "st";
//         case 2:
//           return "nd";
//         case 3:
//           return "rd";
//         default:
//           return "th";
//       }
//     };

//     return `${day}${ordinalSuffix(day)} ${month}, ${year}`;
//   };

//   // Array of light shades
//   const lightColors = [
//     "rgba(215,215,201,0.5)",
//     "rgba(255,235,197,0.5)",
//     "rgba(245, 198, 255, 0.5)",
//     "rgba(252,205,206,0.5)",
//     "rgba(185, 185, 185, 0.5)",
//   ];

//   // Function to pick a random color from the pool and ensure no repetition for adjacent cards
//   const getUniqueColor = (prevColor) => {
//     let newColor;
//     do {
//       newColor = lightColors[Math.floor(Math.random() * lightColors.length)];
//     } while (newColor === prevColor);
//     return newColor;
//   };

//   return (
//     <div className="cards">
//       <input
//         type="text"
//         placeholder="Search by name or description"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="search-box"
//       />
//       {sortedDates &&
//         sortedDates.map((date) => {
//           let prevColor = null; // Track the previous card's color
//           return (
//             <div key={date} className="date-group">
//               <p>{formatDate(date)}</p>
//               <div className="card-container">
//                 {groupedInvoices[date].map((card) => {
//                   const cardColor = getUniqueColor(prevColor);
//                   prevColor = cardColor; // Update the previous color
//                   return (
//                     <div
//                       key={card.id}
//                       className="card"
//                       style={{ backgroundColor: cardColor }}
//                     >
//                       <h3>{card?.name}</h3>
//                       <p>{trimDescription(card?.description)}</p>
//                       <CircleChevronRight
//                         size={30}
//                         className="arrow-right-cards"
//                       />
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           );
//         })}
//     </div>
//   );
// };

// export default Cards;

import { lineWobble } from 'ldrs'


import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
// import useGetFromFirestore from "../../../app/Hooks/useGetFromFirestore";
// import { AuthProvider, useAuth } from "./../../../AuthProvider";
// import { CircleChevronRight } from "lucide-react";
import "./Cards.css";
import useGetFromFirestore from "../../../app/Hooks/useGetFromFirestore";
import { AuthProvider, useAuth } from "./../../../AuthProvider";
import { CircleChevronRight } from "lucide-react";
import { Link } from 'react-router-dom';

const Cards = () => {
  const { user } = useAuth();
  const { invoices } = useGetFromFirestore(user?.email);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView());
  
lineWobble.register()

// Default values shown

function getSlidesPerView() {
  const width = window.innerWidth;
  if(width >= 1900) return 5;
  if (width >= 1400) return 4;
  if (width >= 1024) return 3;
  if (width >= 700) return 2;
  // if (width >= 768) return 2;
  return 1;
}


useEffect(() => {
  const handleResize = () => {
    setSlidesPerView(getSlidesPerView());
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


  const trimDescription = (description) => {
    const words = description?.split(" ");
    return words.length > 20
      ? words.slice(0, 20).join(" ") + "..."
      : description;
  };


  useEffect(() => {
    if (invoices.length===0) {
      setIsLoading(true); // Still loading
    } else {
      setIsLoading(false); // Data fetched
    }
  }, [invoices]);

  const groupByDate = (data) => {
    return data.reduce((groups, invoice) => {
      const date = new Date(Number(invoice.date));
      const normalizedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ).getTime();
      if (!groups[normalizedDate]) {
        groups[normalizedDate] = [];
      }
      groups[normalizedDate].push(invoice);
      return groups;
    }, {});
  };

  const groupedInvoices = groupByDate(
    invoices?.filter(
      (card) =>
        card.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  console.log(groupedInvoices)

  const sortedDates = Object.keys(groupedInvoices).sort((a, b) => b - a);

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp));
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const ordinalSuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    return `${day}${ordinalSuffix(day)} ${month}, ${year}`;
  };

  const lightColors = [
    "rgba(215,215,201,0.5)",
    "rgba(255,235,197,0.5)",
    "rgba(245, 198, 255, 0.5)",
    "rgba(252,205,206,0.5)",
    "rgba(185, 185, 185, 0.5)",
  ];

  const getUniqueColor = (prevColor) => {
    let newColor;
    do {
      newColor = lightColors[Math.floor(Math.random() * lightColors.length)];
    } while (newColor === prevColor);
    return newColor;
  };

  return (
    <div className="cards">
      <input
        type="text"
        placeholder="Search by name or description"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-box"
      />
          {isLoading && 
          <div className='ldrs'>
          <l-line-wobble
      size="80"
      stroke="5"
      bg-opacity="0.1"
      speed="1.75" 
      color="black" 
    ></l-line-wobble>
    </div>
    }
      {sortedDates ?
        sortedDates.map((date) => {
          let prevColor = null;
          return (
            <div key={date} className="date-group">
              <p>{formatDate(date)}</p>
              <Swiper
                modules={[Navigation, FreeMode, Mousewheel]}
                navigation
                // freeMode={true}
                // mousewheel={true}
                spaceBetween={50}
                slidesPerView={slidesPerView}  
                // slidesPerView={4}  
                // centeredSlides={true}

                className="swiper-container"
              >
                {groupedInvoices[date].map((card) => {
                  const cardColor = getUniqueColor(prevColor);
                  prevColor = cardColor;
                  return (
                    <SwiperSlide key={card.id} 
                    // style={slidesPerView === 1 ? { width: "100%" } : {}}
                    >
                      <Link to={`/details/${card?.id}`}>
                      <div
                        className="card"
                        style={{ backgroundColor: cardColor }}
                      >
                        <h3>{card?.name}</h3>
                        <p>{trimDescription(card?.description)}</p>
                        <CircleChevronRight
                          size={30}
                          className="arrow-right-cards"
                        />
                      </div>
                    </Link>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          );
        }) 
        :(
          <div style={{fontSize:"100px"}}>
            <p>Nothing to show</p>
          </div>
        )
        }
    </div>
  );
};

export default Cards;
