import { useState } from "react";
import { router } from "expo-router";
import { useStore } from "../store";
import { Button, Chips, Page } from "../components/ui";
import { ProfileForm, sections } from "../features/onboarding/ProfileForm";
import { blankUser } from "../data/profiles";
import { validatePerson } from "../utils/domain";
export default function EditProfile() {
  const { state, complete } = useStore();
  const [person, setPerson] = useState(state.user || blankUser);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  return (
    <Page back title="Your story, evolving." kicker="EDIT PROFILE">
      <Chips
        values={sections}
        selected={[sections[step]]}
        onSelect={(x) => setStep(sections.indexOf(x))}
      />
      <ProfileForm
        value={person}
        onChange={setPerson}
        step={step}
        error={error}
        onError={setError}
      />
      <Button
        title="Save your story"
        onPress={() => {
          const issue = validatePerson(person);
          setError(issue);
          if (!issue) {
            complete({
              ...person,
              name: person.name.trim(),
              city: person.city.trim(),
            });
            router.back();
          }
        }}
      />
    </Page>
  );
}
