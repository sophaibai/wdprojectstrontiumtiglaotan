import React, { useState } from 'react';
// Importing a custom Button component
import { Button } from '@/components/ui/button';

const CalorieTracker = () => {
  // State to store the final calculated BMR
  const [bmr, setBmr] = useState<number | null>(null);
  // Input states for user provided age, heigh, and weight
  const [age, setAge] = useState<number | string>('');
  const [height, setHeight] = useState<number | string>('');
  const [weight, setWeight] = useState<number | string>('');

  // Gender selection ('male' or 'female')
  const [gender, setGender] = useState<string>('male');

  // Activity level (used as index for activity multipliers)
  const [activityLevel, setActivityLevel] = useState<number>(0);

  // Function to calculate bMR using the Miffline-St Jeor ewuation
  const calculateBMR = () => {
    // Convert input values to numbers (in case they come as strings)
    const ageNum = Number(age);
    const heightNum = Number(height);
    const weightNum = Number(weight);

    // input validation - alert if any field is missing or invalid
    if (!ageNum || !heightNum || !weightNum) {
      alert('Please enter age, height, and weight.');
      return;
    }

    let calculatedBMR: number;
    // BMR formula differs by gender
    if (gender === 'male') {
      calculatedBMR = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      calculatedBMR = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }
    // Activity multipliers: BMR (resting)
    const activityMultipliers = [1, 1.2, 1.375, 1.55, 1.725, 1.9];

    // Multiple BMR by selected activity level factor
    calculatedBMR *= activityMultipliers[activityLevel];
    // Save the final result in state
    setBmr(calculatedBMR);
  };

  return (
    <div className="w-full md:w-4/10 h-auto bg-white rounded-md p-4 shadow-sm relative">
      <h2 className="text-lg font-semibold">Calorie Calculator</h2>
      <div className="absolute right-2 top-2">
        <a
          href="https://reference.medscape.com/calculator/846/mifflin-st-jeor-equation"
          target="_blank"
          rel="noopener noreferrer"
        >
          ?
        </a>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-2">
        <span>Age: </span>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full sm:w-1/4 p-2.5"
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-2">
        <span>Height (cm): </span>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full sm:w-1/4 p-2.5"
          id="height"
          type="number"
          placeholder="cm"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-2">
        <span>Weight (kg): </span>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full sm:w-1/4 p-2.5"
          id="weight"
          type="number"
          placeholder="kg"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-2">
        <label htmlFor="gender">Gender:</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full sm:w-1/2 p-2.5"
          id="gender"
          name="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-2">
        <label htmlFor="activity">Activity Level</label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full sm:w-1/2 p-2.5"
          id="activity"
          name="activity"
          value={activityLevel}
          onChange={(e) => setActivityLevel(Number(e.target.value))}
        >
          <option value={0}>Basal Metabolic Rate (BMR)</option>
          <option value={1}>Sedentary—little or no exercise</option>
          <option value={2}>Light—exercise 1–2x/week</option>
          <option value={3}>Moderate—exercise 3–5x/week</option>
          <option value={4}>Active—daily exercise</option>
          <option value={5}>Very Active—intense exercise daily</option>
        </select>
      </div>

      <Button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={calculateBMR}
      >
        Calculate
      </Button>

      <div id="calculatedBMR">
        {bmr !== null && (
          <p>Your estimated BMR: {bmr.toFixed(2)} calories/day</p>
        )}
      </div>
    </div>
  );
};

  export default CalorieTracker;
