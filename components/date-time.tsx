"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateAndTimeProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

export function DateAndTime({ value, onChange }: DateAndTimeProps) {
  const [open, setOpen] = React.useState(false);

  const currentTime = value
    ? `${value.getHours().toString().padStart(2, "0")}:${value
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    : "10:30";

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) return;

    if (value) {
      newDate.setHours(value.getHours());
      newDate.setMinutes(value.getMinutes());
      newDate.setSeconds(0);
    }

    onChange?.(newDate);
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    const [hours, minutes] = time.split(":").map(Number);

    const newDate = value ? new Date(value) : new Date();
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(0);

    onChange?.(newDate);
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3 flex-1">
        <Label htmlFor="date-picker" className="px-1 text-sm font-medium">
          Día
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              type="button" // Evita disparar el submit del form
              id="date-picker"
              className="w-full justify-between font-normal"
            >
              {value ? value.toLocaleDateString() : "Seleccionar fecha"}
              <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateChange}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1 text-sm font-medium">
          Horario
        </Label>
        <Input
          type="time"
          id="time-picker"
          value={currentTime}
          onChange={handleTimeChange}
          className="bg-background w-30"
        />
      </div>
    </div>
  );
}
