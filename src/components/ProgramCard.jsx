// components/ProgramCard.js

const ProgramCard = ({ program }) => (
  <div className="bg-white p-4 rounded-lg border">
    <h4 className="font-semibold text-gray-900 mb-2">{program.name}</h4>
    <p className="text-sm text-gray-600 mb-3">{program.description}</p>

    <div className="space-y-2 text-sm">
      {program.duration && (
        <div className="flex justify-between">
          <span className="text-gray-500">Duration:</span>
          <span className="font-medium">{program.duration}</span>
        </div>
      )}
      {program.tuitionFee && (
        <div className="flex justify-between">
          <span className="text-gray-500">Tuition Fee:</span>
          <span className="font-medium text-green-600">${program.tuitionFee}</span>
        </div>
      )}
      {program.level && (
        <div className="flex justify-between">
          <span className="text-gray-500">Level:</span>
          <span className="font-medium">{program.level}</span>
        </div>
      )}
      {program.applicationDeadline && (
        <div className="flex justify-between">
          <span className="text-gray-500">Deadline:</span>
          <span className="font-medium">
            {new Date(program.applicationDeadline).toLocaleDateString()}
          </span>
        </div>
      )}
      {program.school?.name && (
        <div className="flex justify-between">
          <span className="text-gray-500">School:</span>
          <span className="font-medium">{program.school.name}</span>
        </div>
      )}
    </div>
  </div>
);

export default ProgramCard;
