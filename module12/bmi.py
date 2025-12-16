# Klasa bazë Person
class Person:
    def __init__(self, emri, mosha):
        self.emri = emri
        self.mosha = mosha

    # Metodë që do të mbishkruhet (polymorphism)
    def show_info(self):
        pass


# Klasa BMI trashëgon nga Person
class BMI(Person):
    def __init__(self, emri, mosha, pesha, gjatesia):
        super().__init__(emri, mosha)
        self.pesha = pesha
        self.gjatesia = gjatesia

    def calculate_bmi(self):
        return self.pesha / (self.gjatesia ** 2)

    # Polymorphism: mbishkrimi i metodës show_info
    def show_info(self):
        bmi = self.calculate_bmi()

        if bmi < 18.5:
            kategoria = "Underweight"
        elif 18.5 <= bmi < 25:
            kategoria = "Normal weight"
        elif 25 <= bmi < 30:
            kategoria = "Overweight"
        else:
            kategoria = "Obese"

        print("\n--- TË DHËNAT E PERSONIT ---")
        print(f"Emri: {self.emri}")
        print(f"Mosha: {self.mosha} vjeç")
        print(f"Pesha: {self.pesha} kg")
        print(f"Gjatësia: {self.gjatesia} m")
        print(f"BMI: {bmi:.2f}")
        print(f"Kategoria: {kategoria}")


# Programi kryesor
emri = input("Shkruani emrin: ")
mosha = int(input("Shkruani moshën: "))
pesha = float(input("Shkruani peshën (kg): "))
gjatesia = float(input("Shkruani gjatësinë (m): "))

personi = BMI(emri, mosha, pesha, gjatesia)
personi.show_info()
