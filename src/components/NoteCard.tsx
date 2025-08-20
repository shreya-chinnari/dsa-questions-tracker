"use client";

import { Dispatch, SetStateAction } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

type NoteCardProps = {
    date: string;
    notes: { [date: string]: string };
    setNotes: Dispatch<SetStateAction<{ [date: string]: string }>>;
};

const NoteCard = ({ date, notes, setNotes }: NoteCardProps) => {

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newNotes = { ...notes, [date]: e.target.value };
        setNotes(newNotes);
    };

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Card className="shadow-lg rounded-xl">
            <CardHeader>
                <CardTitle className="text-lg font-bold">{formattedDate}</CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder="Write your notes for the day..."
                    value={notes[date] || ''}
                    onChange={handleNoteChange}
                    className="min-h-[120px] resize-none"
                />
            </CardContent>
        </Card>
    );
};

export default NoteCard;
