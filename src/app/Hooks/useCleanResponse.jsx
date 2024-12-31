

function useCleanResponse(responseText){
    function cleanResponse(responseText) {
        try {
          // Remove backticks and the word "json"
          const cleanedResponse = responseText
            .replace(/`/g, "") // Remove all backticks
            .replace(/json/gi, "") // Remove occurrences of "json" (case-insensitive)
            .trim(); // Remove leading/trailing whitespace
      
          // Parse the cleaned response into JSON
          const parsedData = JSON.parse(cleanedResponse);
      
          return parsedData; // Return the JSON object
        } catch (error) {
          console.error("Error parsing cleaned response:", error.message);
          throw new Error("Failed to clean and parse response into JSON.");
        }
      }
    return {cleanResponse};
}

export default useCleanResponse;