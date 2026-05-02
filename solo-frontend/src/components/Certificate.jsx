import { forwardRef } from 'react';

const Certificate = forwardRef(({ studentName, courseName, date }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white text-gray-800 p-12 w-[900px] h-[650px] relative font-serif mx-auto"
    >
      {/* Decorative Borders */}
      <div className="absolute inset-4 border-8 border-double border-gray-300 pointer-events-none"></div>
      <div className="absolute inset-8 border border-gray-200 pointer-events-none"></div>

      <div className="flex flex-col items-center justify-center h-full text-center">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-3 tracking-widest text-gray-900 uppercase">Certificate</h1>
          <h2 className="text-3xl font-light tracking-widest text-gray-600 uppercase">Of Completion</h2>
        </div>

        <p className="text-xl italic text-gray-500 mb-6">This is to proudly certify that</p>

        {/* Student Name */}
        <h3 className="text-5xl font-bold text-primary mb-6 border-b-2 border-primary/20 pb-2 inline-block px-10">
          {studentName}
        </h3>

        <p className="text-xl text-gray-600 mb-6 max-w-2xl leading-relaxed">
          has successfully completed all the requirements and mastered the curriculum for the course
        </p>

        {/* Course Name */}
        <h4 className="text-4xl font-bold text-gray-800 mb-16">{courseName}</h4>

        {/* Footer Signatures */}
        <div className="flex justify-between w-full px-20 mt-4">
          <div className="text-center">
            <div className="border-b border-gray-400 w-48 pb-2 mb-2 font-bold text-xl">{date}</div>
            <p className="text-sm text-gray-500 uppercase tracking-widest font-sans">Date</p>
          </div>

          <div className="text-center">
            <div className="border-b border-gray-400 w-48 pb-2 mb-2 text-2xl font-bold text-primary italic">Solo E-Learning</div>
            <p className="text-sm text-gray-500 uppercase tracking-widest font-sans">Authorized Signature</p>
          </div>
        </div>
      </div>

      {/* Decorative Seal */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center justify-center">
        <div className="w-28 h-28 bg-yellow-500 rounded-full border-4 border-yellow-600 flex items-center justify-center shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-yellow-400 opacity-20 transform rotate-45"></div>
          <div className="text-center z-10">
            <span className="text-white font-bold text-lg leading-tight block tracking-widest">OFFICIAL</span>
            <span className="text-yellow-100 text-xs tracking-widest">SEAL</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Certificate;
