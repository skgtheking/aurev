import { useState } from "react";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { blankUser } from "../data/profiles";
import { Button, Page } from "../components/ui";
import { ProfileForm, sections } from "../features/onboarding/ProfileForm";
import { useStore } from "../store";
import { adult, validatePerson } from "../utils/domain";
import { colors as c, s } from "../theme";
export default function Onboarding() {
  const [person, setPerson] = useState({ ...blankUser });
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const { complete } = useStore();
  const next = () => {
    let issue = "";
    if (step === 0) {
      if (!adult(person.dob))
        issue = "Enter a valid birth date. You must be at least 18.";
      else if (person.name.trim().length < 2 || person.city.trim().length < 2)
        issue = "Add your name and city to continue.";
    }
    if (step === 1 && !person.seeking.length)
      issue = "Choose at least one dating preference.";
    if (
      step === 2 &&
      (person.interests.length < 2 ||
        person.bio.trim().length < 20 ||
        person.answer.trim().length < 5)
    )
      issue =
        "Choose two interests, add a bio (20+ characters) and answer a prompt (5+ characters).";
    if (step === 3) issue = validatePerson(person);
    setError(issue);
    if (issue) return;
    if (step < 3) setStep(step + 1);
    else {
      complete({
        ...person,
        name: person.name.trim(),
        city: person.city.trim(),
      });
      router.replace("/(tabs)");
    }
  };
  return (
    <Page back title={sections[step]} kicker={`YOUR STORY · ${step + 1} OF 4`}>
      <View style={[s.row, { gap: 6 }]}>
        {sections.map((_, i) => (
          <View
            key={i}
            style={{
              height: 3,
              flex: 1,
              backgroundColor: i <= step ? c.gold : c.border,
            }}
          />
        ))}
      </View>
      <Text style={s.body}>
        Thoughtful introductions begin with a little honesty. Use fictional
        details in this local demo.
      </Text>
      <ProfileForm
        value={person}
        onChange={setPerson}
        step={step}
        error={error}
        onError={setError}
      />
      <Button title={step === 3 ? "Enter Aurev" : "Continue"} onPress={next} />
      {step > 0 && (
        <Button
          title="Previous step"
          variant="quiet"
          onPress={() => {
            setError("");
            setStep(step - 1);
          }}
        />
      )}
    </Page>
  );
}
