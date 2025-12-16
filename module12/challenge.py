# Program BMI në Python

# Marrja e të dhënave nga përdoruesi
emri = input("Shkruani emrin tuaj: ")
mosha = int(input("Shkruani moshën tuaj: "))
pesha = float(input("Shkruani peshën tuaj (kg): "))
gjatesia = float(input("Shkruani gjatësinë tuaj (në metra): "))

# Llogaritja e BMI
bmi = pesha / (gjatesia ** 2)

# Përcaktimi i kategorisë BMI
if bmi < 18.5:
    kategoria = "Underweight"
elif 18.5 <= bmi < 25:
    kategoria = "Normal weight"
elif 25 <= bmi < 30:
    kategoria = "Overweight"
else:
    kategoria = "Obese"

# Shfaqja e të dhënave
print("\n--- TË DHËNAT E PERSONIT ---")
print(f"Emri: {emri}")
print(f"Mosha: {mosha} vjeç")
print(f"Pesha: {pesha} kg")
print(f"Gjatësia: {gjatesia} m")
print(f"BMI: {bmi:.2f}")
print(f"Kategoria: {kategoria}")
