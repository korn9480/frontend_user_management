// MyForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, FormProvider, useFormContext, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FullFormValues, FullSchema } from "@/shame/question";
import { Plus, Trash2 } from "lucide-react";

import {
    Form as ShadcnForm,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const generateTempId = () => `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// --- SKELETON COMPONENT ---
const FormSkeleton = () => (
    <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="md:col-span-3 space-y-8">
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-4 pt-4 border-t">
                            <Skeleton className="h-6 w-1/5" />
                            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 p-4 border rounded-md">
                                <Skeleton className="h-10 flex-grow w-full" />
                                <Skeleton className="h-10 w-full sm:w-24" />
                                <Skeleton className="h-10 w-full sm:w-32" />
                                <Skeleton className="h-10 w-10" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
);

// --- MAIN FORM PAGE ---
export default function MyFormPage() {
    const [loading, setLoading] = useState(true);
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | number | null>(null);
    const [deletedQuestionIds, setDeletedQuestionIds] = useState<number[]>([]);
    const [deletedAnswerIds, setDeletedAnswerIds] = useState<number[]>([]);

    const form = useForm<FullFormValues>({
        resolver: zodResolver(FullSchema),
        defaultValues: {
            title: '',
            questions: []
        }
    });

    const { control, handleSubmit, reset, setValue, getValues } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "questions",
        keyName: "fieldId"
    });

    useEffect(() => {
        const fetchMockData = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockData: FullFormValues = {
                title: "แบบทดสอบความรู้ทั่วไปเกี่ยวกับแมว (จาก API)",
                question_type_id: 1,
                sort: 1,
                questions: [
                    {
                        id: 101, status: 1, message: "แมวสายพันธุ์ใดที่ไม่มีขน?", sort: 1,
                        answers: [
                            { id: 201, status: 1, message: "เปอร์เซีย", sort: 1, is_correct: 0 },
                            { id: 202, status: 1, message: "สฟิงซ์", sort: 2, is_correct: 1 },
                            { id: 203, status: 1, message: "เมนคูน", sort: 3, is_correct: 0 },
                        ],
                    },
                    {
                        id: 102, status: 1, message: "โดยเฉลี่ยแล้วแมวโตเต็มวัยนอนวันละกี่ชั่วโมง?", sort: 2,
                        answers: [
                            { id: 204, status: 1, message: "8-10 ชั่วโมง", sort: 1, is_correct: 0 },
                            { id: 205, status: 1, message: "12-16 ชั่วโมง", sort: 2, is_correct: 1 },
                            { id: 206, status: 1, message: "18-20 ชั่วโมง", sort: 3, is_correct: 0 },
                        ],
                    },
                ],
            };
            reset(mockData);
            setLoading(false);
        };
        fetchMockData();
    }, [reset]);

    useEffect(() => {
        const questions = getValues("questions") || [];
        const firstActiveQuestion = questions.find(q => q.status !== 0);
        if (selectedQuestionId === null && firstActiveQuestion) {
            setSelectedQuestionId(firstActiveQuestion.id || null);
        }
    }, [getValues, selectedQuestionId, fields]);

    const handleAddQuestion = () => {
        const newId = generateTempId();
        const newQuestion = { 
            id: newId,
            status: 1, 
            message: ``, 
            sort: (getValues("questions") || []).length + 1, 
            answers: [{ id: generateTempId(), status: 1, message: "", sort: 1, is_correct: 0 }] 
        };
        append(newQuestion, { shouldFocus: false });
        setSelectedQuestionId(newId);
    };

    const handleRemoveQuestion = (questionId: number | string) => {
        const allQuestions = getValues("questions") || [];
        const index = allQuestions.findIndex(q => q.id === questionId);
        if (index === -1) return;

        // Update selection if the deleted question was selected
        if (selectedQuestionId === questionId) {
            const activeQuestions = allQuestions.filter(q => q.status !== 0 && q.id !== questionId);
            setSelectedQuestionId(activeQuestions.length > 0 ? activeQuestions[0].id! : null);
        }

        const question = allQuestions[index];
        // Hard delete for new items
        if (typeof question.id === 'string') {
            remove(index);
        } 
        // Soft delete for existing items
        else if (typeof question.id === 'number') {
            setDeletedQuestionIds(prev => [...prev, question.id as number]);
            setValue(`questions.${index}.status`, 0, { shouldDirty: true });
        }
    };

    const onSubmit = (data: FullFormValues) => {
        const cleanedData = JSON.parse(JSON.stringify(data));

        cleanedData.questions.forEach((q: any) => {
            if (typeof q.id === 'string' && q.id.startsWith('temp_')) {
                delete q.id;
            }
            q.answers.forEach((a: any) => {
                if (typeof a.id === 'string' && a.id.startsWith('temp_')) {
                    delete a.id;
                }
            });
        });

        const payload = {
            ...cleanedData,
            deletedQuestionIds,
            deletedAnswerIds,
        };
        console.log("Submitted Payload:", payload);
        alert("Check the console for the submitted data including deleted IDs!");
    };

    if (loading) {
        return <FormSkeleton />;
    }

    return (
        <div className="container mx-auto p-4">
            <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>แบบทดสอบ</CardTitle>
                            <CardDescription>กรอกรายละเอียดสำหรับชุดคำถามของคุณ</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={control} name="title" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl><Input placeholder="เช่น แบบทดสอบความรู้ทั่วไป" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={control} name="question_type_id" render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Question Type ID</FormLabel>
                                    <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={control} name="sort" render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>ชุดลำดับ</FormLabel>
                                    <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <QuestionSelector
                            selectedId={selectedQuestionId}
                            onSelect={setSelectedQuestionId}
                            onAdd={handleAddQuestion}
                            onRemove={handleRemoveQuestion}
                        />
                        <div className="md:col-span-3">
                            {selectedQuestionId && (
                                <QuestionEditForm
                                    key={selectedQuestionId}
                                    questionId={selectedQuestionId}
                                    setDeletedAnswerIds={setDeletedAnswerIds}
                                />
                            )}
                        </div>
                    </div>

                    <Button type="submit" size="lg">บันทึกแบบทดสอบทั้งหมด</Button>
                </form>
            </FormProvider>
        </div>
    );
}

function QuestionSelector({ selectedId, onSelect, onAdd, onRemove }: {
    selectedId: string | number | null;
    onSelect: (id: string | number) => void;
    onAdd: () => void;
    onRemove: (id: string | number) => void;
}) {
    const { control } = useFormContext();
    const questions = useWatch({ control, name: "questions" }) || [];
    const activeQuestions = questions.filter(q => q.status !== 0);

    return (
        <div className="md:col-span-1 space-y-2">
            <h3 className="text-lg font-semibold mb-2">Questions</h3>
            <Button type="button" variant="outline" onClick={onAdd} className="w-full flex items-center gap-2 mb-4">
                <Plus className="h-4 w-4" /> Add Question
            </Button>
            <div className="space-y-2">
                {activeQuestions.map((question, index) => (
                    <div key={question.id} className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant={selectedId === question.id ? "secondary" : "ghost"}
                            onClick={() => onSelect(question.id!)}
                            className="flex-grow justify-start truncate text-left"
                        >
                            #{index + 1}: {question.message || "New Question"}
                        </Button>
                        <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(question.id!)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function QuestionEditForm({ questionId, setDeletedAnswerIds }: { questionId: string | number, setDeletedAnswerIds: React.Dispatch<React.SetStateAction<number[]>> }) {
    const { control, getValues } = useFormContext<FullFormValues>();
    const questions = getValues("questions") || [];
    const questionIndex = questions.findIndex(q => q.id === questionId);

    if (questionIndex === -1) return null;

    return (
        <Card className="relative">
            <CardHeader>
                <CardTitle>แก้ไขคำถาม #{questionIndex + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField control={control} name={`questions.${questionIndex}.message`} render={({ field }) => (
                    <FormItem>
                        <FormLabel>เนื้อหาคำถาม</FormLabel>
                        <FormControl><Input placeholder={`เนื้อหาสำหรับคำถามที่ ${questionIndex + 1}`} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <QuestionAnswersForm questionIndex={questionIndex} setDeletedAnswerIds={setDeletedAnswerIds} />
            </CardContent>
        </Card>
    );
}

function QuestionAnswersForm({ questionIndex, setDeletedAnswerIds }: { questionIndex: number, setDeletedAnswerIds: React.Dispatch<React.SetStateAction<number[]>> }) {
    const { control, getValues, setValue } = useFormContext<FullFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: `questions.${questionIndex}.answers`,
        keyName: "fieldId"
    });

    const handleAddAnswer = () => {
        const newId = generateTempId();
        append({ id: newId, status: 1, message: "", sort: fields.length + 1, is_correct: 0 }, { shouldFocus: false });
    };

    const handleRemoveAnswer = (answerId: number | string) => {
        const answers = getValues(`questions.${questionIndex}.answers`) || [];
        const index = answers.findIndex(a => a.id === answerId);
        if (index === -1) return;

        const answer = answers[index];
        // Hard delete for new items
        if (typeof answer.id === 'string') {
            remove(index);
        } 
        // Soft delete for existing items
        else if (typeof answer.id === 'number') {
            setDeletedAnswerIds(prev => [...prev, answer.id as number]);
            setValue(`questions.${questionIndex}.answers.${index}.status`, 0, { shouldDirty: true });
        }
    };

    const answers = useWatch({ control, name: `questions.${questionIndex}.answers` }) || [];
    const activeAnswers = answers.filter(a => a.status !== 0);

    return (
        <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Answers</h3>
                <Button type="button" variant="secondary" onClick={handleAddAnswer}>
                    เพิ่มคำตอบ
                </Button>
            </div>
            {activeAnswers.map((answer) => (
                <AnswerItem
                    key={answer.id}
                    questionIndex={questionIndex}
                    answerId={answer.id!}
                    onRemove={handleRemoveAnswer}
                />
            ))}
        </div>
    );
}

function AnswerItem({ questionIndex, answerId, onRemove }: {
    questionIndex: number;
    answerId: number | string;
    onRemove: (answerId: number | string) => void;
}) {
    const { control, getValues } = useFormContext();
    const answers = getValues(`questions.${questionIndex}.answers`) || [];
    const answerIndex = answers.findIndex(a => a.id === answerId);

    if (answerIndex === -1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 p-4 border rounded-md bg-slate-50">
            <FormField control={control} name={`questions.${questionIndex}.answers.${answerIndex}.message`} render={({ field }) => (
                <FormItem className="flex-grow w-full">
                    <FormLabel>ตัวเลือก #{answerIndex + 1}</FormLabel>
                    <FormControl><Input placeholder={`เนื้อหาสำหรับตัวเลือกที่ ${answerIndex + 1}`} {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={control} name={`questions.${questionIndex}.answers.${answerIndex}.sort`} render={({ field }) => (
                <FormItem className="w-full sm:w-24">
                    <FormLabel>Sort</FormLabel>
                    <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={control} name={`questions.${questionIndex}.answers.${answerIndex}.is_correct`} render={({ field }) => (
                <FormItem className="w-full sm:w-32">
                    <FormLabel>Correct</FormLabel>
                    <Select onValueChange={value => field.onChange(parseInt(value, 10))} value={String(field.value)}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="0">False</SelectItem>
                            <SelectItem value="1">True</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />
            <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(answerId)} className="mt-4 sm:mt-0">
                <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
        </div>
    );
}
