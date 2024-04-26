import React from "react";

function ODMatrixTable({ odMatrix }) {
  // Get the stage names from the first object in the array
  const stages = Object.keys(odMatrix[0]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">OD Matrix</h2>
      <div className="overflow-x-auto">
        <table className="border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Stage</th>
              {stages.map((stage, index) => (
                <th key={index} className="border border-gray-300 px-4 py-2">
                  {stage}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {odMatrix.map((entry, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border border-gray-300 px-4 py-2">
                  {stages[rowIndex]}
                </td>
                {Object.values(entry).map((count, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    className="border border-gray-300 px-4 py-2"
                  >
                    {count}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ODMatrixTable;
