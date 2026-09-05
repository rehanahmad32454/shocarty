// import React from "react";

// export const Profile = () => {
//   return (
//     <div>
//       {/* profile image picture section left side */}
//       <div>
//         <img></img>
//       </div>
//       {/* change profile picture button right side and upload */}
//       <div>
//         <input type="file"></input>
//         {/* image save button */}
//         <div></div>
//       </div>
//     </div>
//   );
// };
import React from "react";
import { useForm } from "react-hook-form";

export const Profile = () => {
  return (
    <form className="bg-red-300">
      {/* profile image picture section left side */}
      <div>
        <img></img>
      </div>
      {/* change profile picture button right side and upload */}
      <div>
        <input type="file"></input>
        {/* image save button */}
        <div></div>
      </div>
    </form>
  );
};
