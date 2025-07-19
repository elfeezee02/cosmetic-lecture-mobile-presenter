import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface Test {
  id: string;
  title: string;
  questions: Question[] | any;
  passing_score: number;
}

interface TestComponentProps {
  test: Test;
  onComplete: (score: number) => void;
  onCancel: () => void;
}

export const TestComponent = ({ test, onComplete, onCancel }: TestComponentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  // Ensure questions is an array
  const questions = Array.isArray(test.questions) ? test.questions : [];
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const goToNextQuestion = () => {
    if (isLastQuestion) {
      submitTest();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  };

  const submitTest = () => {
    const correctAnswers = questions.filter((question, index) => 
      answers[index] === question.correct
    ).length;
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    setShowResults(true);
    
    setTimeout(() => {
      onComplete(score);
    }, 3000);
  };

  const getScore = () => {
    const correctAnswers = questions.filter((question, index) => 
      answers[index] === question.correct
    ).length;
    
    return Math.round((correctAnswers / questions.length) * 100);
  };

  if (showResults) {
    const score = getScore();
    const passed = score >= test.passing_score;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              <CheckCircle className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl">
              {passed ? 'Congratulations!' : 'Test Not Passed'}
            </CardTitle>
            <CardDescription>
              You scored {score}% on the {test.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-lg">
              {passed ? (
                <p className="text-green-600">
                  You passed! You'll be moved to the next module automatically.
                </p>
              ) : (
                <p className="text-red-600">
                  You need {test.passing_score}% to pass. You can retake the test anytime.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Correct answers:</span>
                <span>{questions.filter((q, i) => answers[i] === q.correct).length} / {questions.length}</span>
              </div>
              <Progress value={score} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-4">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
            <div className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{test.title}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={answers[currentQuestionIndex]?.toString()}
              onValueChange={(value) => handleAnswerSelect(currentQuestionIndex, parseInt(value))}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="flex-1 cursor-pointer p-2 rounded hover:bg-accent"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={goToNextQuestion}
                disabled={answers[currentQuestionIndex] === undefined}
              >
                {isLastQuestion ? 'Submit Test' : 'Next'}
                {!isLastQuestion && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};