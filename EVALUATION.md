# GramSetu AI - Module Evaluation & Testing Report

This document details the functional evaluations, testing protocols, failure modes, and verification matrices for each module in the GramSetu AI platform.

---

## 1. SwachhAudit Evaluation

### Purpose
To identify public waste, evaluate sanitation levels, and compile exportable PDF reports locally.

### Expected Outcome
The system should detect dry waste, wet waste, and sanitation issues in camera frames, display bounding boxes in the UI, and compute a cleanliness score.

### Testing Performed
- **Manual Verification**: Tested with image uploads of various waste scenarios (littered street, clean park, open sewer). Verified that bounding boxes are drawn on the preview canvas and cleanliness scores update.
- **Edge Cases**: Uploaded images with no waste. The system correctly calculated a cleanliness score of `100/100` and displayed the "Area is clean" status message.
- **Known Limitations**: Bounding box accuracy is dependent on lighting and camera angles. Under low light, the YOLO model can miss small items or misidentify shadows.
- **Failure Cases**: If ONNX Runtime Web fails to initialize due to browser incompatibility, the module switches to a mock adapter to generate realistic detections, maintaining workflow continuity.
- **Accuracy Benchmarks**: Formal accuracy evaluation (mAP) is pending.

---

## 2. JalDrishti Evaluation

### Purpose
To analyze water testing strips and provide parameter status indicators.

### Expected Outcome
The system should crop the camera frame to the alignment region, extract average RGB values from 3 pad regions, and map them to Nitrate, Nitrite, and pH reference levels.

### Testing Performed
- **Manual Verification**: Aligned test strip images within the alignment guide box. Verified that colors are correctly extracted and matched against reference levels.
- **Edge Cases**: Strip placed upside down.
  - *Result*: Color matching matches pads to incorrect parameters. The user guide highlights correct alignment to prevent this failure case.
- **Known Limitations**: Ambient light changes (e.g. warm indoor lighting vs direct cool sunlight) shift color readings, potentially causing incorrect status assignments.
- **Failure Cases**: Extremely low contrast or dark frames fail to resolve valid colors. The system displays a warning and prompts the user to upload a clear, well-lit photo of the strip.
- **Accuracy Benchmarks**: Formal accuracy evaluation is pending.

---

## 3. GramLipi Evaluation

### Purpose
To extract notice text and translate/simplify it between English and Kannada.

### Expected Outcome
The system should extract notice text, display it in an editable preview card, and return translated summaries and simplified text layouts.

### Testing Performed
- **Manual Verification**: Uploaded photos of printed government notices. Verified that Tesseract.js extracts notice text and displays it in the UI.
- **Edge Cases**: Low-contrast circulars.
  - *Result*: Preprocessing (adaptive contrast stretching) successfully enhanced text readability, reducing OCR character error rates.
- **Known Limitations**: Handwritten scripts are not supported by the OCR worker. The LLM translation quality is dependent on the local model pulled in Ollama.
- **Failure Cases**: Ollama server offline. The system displays a connection error message, allowing the user to view the raw extracted text.
- **Accuracy Benchmarks**: Formal translation and OCR evaluations are pending.

---

## 4. SwachhSankalp Evaluation

### Purpose
To track village sanitation checklists, display ranking leaderboards, and update cleanliness scores.

### Expected Outcome
Checking tasks off the list should update the cleanliness score gauge and update user achievements.

### Testing Performed
- **Manual Verification**: Interacted with the checklist items and joined cleanup campaigns. Verified that the village cleanliness score updates and achievements unlock.
- **Edge Cases**: Completing all checklist tasks.
  - *Result*: Clears the checklist progress and unlocks the "Green Village Award" achievement badge.
- **Known Limitations**: Currently uses browser LocalStorage for data persistence, which is limited to the current browser profile.
- **Failure Cases**: Clearing browser cache resets the checklist state to default values.
- **Accuracy Benchmarks**: Logic validation has been completed, confirming that calculations match expected outputs.

---

## 5. Verification Matrix

| Module | Test Case | Inputs | Expected Output | Status |
| :--- | :--- | :--- | :--- | :---: |
| **SwachhAudit** | Clean street | Image with no waste | Cleanliness score `100/100`, "Area is clean" notes | **Pass** |
| **SwachhAudit** | Littered area | Waste dump image | Score below `40/100`, bounding boxes drawn | **Pass** |
| **JalDrishti** | Clean water | Test strip snapshot | All parameters within safe range | **Pass** |
| **JalDrishti** | Acidic sample | Low-pH strip snapshot | pH status rated "unsafe", warning recommendation | **Pass** |
| **GramLipi** | Clear notice | High-res notice photo | High OCR confidence score, clean text output | **Pass** |
| **GramLipi** | Translation | Notice text | Simple translation in selected language | **Pass** |
| **SwachhSankalp**| Task update | Toggle task complete | Cleanliness score updates, local state updated | **Pass** |
