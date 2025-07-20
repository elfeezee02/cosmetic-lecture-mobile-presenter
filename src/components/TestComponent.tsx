import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { MobileLayout } from "@/components/MobileLayout";

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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  // Ensure questions is an array
  const questions = Array.isArray(test.questions) ? test.questions : [];

  const handleAnswerSelect = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = () => {
    const correctAnswers = questions.filter((question, index) => 
      answers[index] === question.options[question.correct]
    ).length;
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    setShowResults(true);
    
    setTimeout(() => {
      onComplete(score);
    }, 3000);
  };

  const getScore = () => {
    const correctAnswers = questions.filter((question, index) => 
      answers[index] === question.options[question.correct]
    ).length;
    
    return Math.round((correctAnswers / questions.length) * 100);
  };

  if (showResults) {
    const score = getScore();
    const correctAnswers = questions.filter((question, index) => 
      answers[index] === question.options[question.correct]
    ).length;

    return (
      <MobileLayout 
        showBackButton={true} 
        backTo="#"
        title="Test Results"
      >
        <div className="p-4">
          <Card className="w-full">
            <CardContent className="p-6">
              <div className="text-center space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  {score >= test.passing_score ? (
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  ) : (
                    <XCircle className="h-16 w-16 text-red-500" />
                  )}
                  
                  <div>
                    <h3 className="text-2xl font-bold">
                      {score >= test.passing_score ? "Congratulations!" : "Test Failed"}
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      Your score: {score}% ({correctAnswers} out of {questions.length})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {score >= test.passing_score 
                        ? "You passed the test! You can now proceed to the next module."
                        : `You need ${test.passing_score}% to pass. Please review the material and try again.`
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => onComplete(score)}
                    className="w-full"
                    size="lg"
                  >
                    {score >= test.passing_score ? "Continue" : "Try Again"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MobileLayout>
    );
  }

  // Non-results view
  return (
    <MobileLayout 
      showBackButton={true} 
      backTo="#"
      title={`Test: ${test.title}`}
    >
      <div className="p-4">
        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={onCancel} size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel Test
              </Button>
            </div>
            <CardTitle>{test.title}</CardTitle>
            <CardDescription>
              Question {currentQuestion + 1} of {questions.length} • {test.passing_score}% required to pass
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">
                  {questions[currentQuestion].question}
                </h3>
                <RadioGroup
                  value={answers[currentQuestion] || ""}
                  onValueChange={handleAnswerSelect}
                >
                  {questions[currentQuestion].options.map((option: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/50">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                
                {currentQuestion === questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!answers[currentQuestion]}
                  >
                    Submit Test
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!answers[currentQuestion]}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};