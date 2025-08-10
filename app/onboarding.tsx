import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen() {
  const [step, setStep] = useState<'info' | 'quiz' | 'review'>('info');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);

  const QUESTIONS = [
    {
      q: 'What comes next in the sequence: 2, 4, 6, ___?',
      options: ['7', '8', '9', '10'],
      correct: 1,
    },
    {
      q: 'If a triangle has sides 3 cm, 4 cm, and 5 cm, it is a ___ triangle?',
      options: ['Equilateral', 'Right-angled', 'Isosceles', 'Scalene'],
      correct: 1,
    },
    {
      q: 'Solve: 15 × 3 = ?',
      options: ['30', '35', '45', '50'],
      correct: 2,
    },
    {
      q: 'Water freezes at what temperature (°C)?',
      options: ['0', '10', '20', '100'],
      correct: 0,
    },
    {
      q: 'Which is the largest planet in our solar system?',
      options: ['Earth', 'Saturn', 'Jupiter', 'Mars'],
      correct: 2,
    },
  ];

  const toggleSubject = (sub: string) => {
    if (subjects.includes(sub)) {
      setSubjects(subjects.filter(s => s !== sub));
    } else {
      setSubjects([...subjects, sub]);
    }
  };

  const calculateScore = () => {
    let score = 0;
    QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.correct) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = async () => {
    try {
      const profile = {
        name,
        age,
        grade,
        subjects,
        answers,
        score: calculateScore(),
      };
      await AsyncStorage.setItem('onboardingData', JSON.stringify(profile));
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');

      Alert.alert('Success', 'Your learning profile is ready!');
      router.replace('/chat');
    } catch (error) {
      Alert.alert('Error', 'Could not save profile. Please try again.');
    }
  };

  const renderInfoStep = () => (
    <ScrollView
      contentContainerStyle={[styles.scroll, { flexGrow: 1, justifyContent: 'center' }]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.sectionTitle}>Basic Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#6B7280"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        placeholderTextColor="#6B7280"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Grade/Class"
        placeholderTextColor="#6B7280"
        value={grade}
        onChangeText={setGrade}
      />
      <Text style={styles.subTitle}>Favorite Subjects</Text>
      <View style={styles.chipContainer}>
        {['Math', 'Science', 'English', 'History', 'Art'].map(sub => (
          <TouchableOpacity
            key={sub}
            style={[
              styles.chip,
              subjects.includes(sub) && styles.chipSelected,
            ]}
            onPress={() => toggleSubject(sub)}
          >
            <Text
              style={[
                styles.chipText,
                subjects.includes(sub) && styles.chipTextSelected,
              ]}
            >
              {sub}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (!name || !age || !grade || subjects.length === 0) {
            Alert.alert('Error', 'Please fill all fields');
            return;
          }
          setStep('quiz');
        }}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );


  const renderQuizStep = () => (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.sectionTitle}>Quick Quiz</Text>
      {QUESTIONS.map((item, index) => (
        <View key={index} style={styles.questionBlock}>
          <Text style={styles.questionText}>{index + 1}. {item.q}</Text>
          {item.options.map((opt, optIndex) => (
            <TouchableOpacity
              key={optIndex}
              style={[
                styles.option,
                answers[index] === optIndex && styles.optionSelected,
              ]}
              onPress={() => {
                const updated = [...answers];
                updated[index] = optIndex;
                setAnswers(updated);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  answers[index] === optIndex && styles.optionTextSelected,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (answers.length !== QUESTIONS.length) {
            Alert.alert('Error', 'Please answer all questions');
            return;
          }
          setStep('review');
        }}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderReviewStep = () => (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.sectionTitle}>Review Your Details</Text>
      <Text style={styles.reviewText}>Name: {name}</Text>
      <Text style={styles.reviewText}>Age: {age}</Text>
      <Text style={styles.reviewText}>Grade: {grade}</Text>
      <Text style={styles.reviewText}>
        Subjects: {subjects.join(', ')}
      </Text>
      <Text style={styles.reviewText}>
        Quiz Score: {calculateScore()} / {QUESTIONS.length}
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Confirm & Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {step === 'info' && renderInfoStep()}
      {step === 'quiz' && renderQuizStep()}
      {step === 'review' && renderReviewStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 24,
  },
  scroll: {
    paddingBottom: 40,
    paddingTop: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#6B7280',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  chipText: {
    color: '#FFFFFF',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  questionBlock: {
    marginBottom: 24,
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  option: {
    borderWidth: 1,
    borderColor: '#6B7280',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  optionText: {
    color: '#FFFFFF',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 8,
  },
});
