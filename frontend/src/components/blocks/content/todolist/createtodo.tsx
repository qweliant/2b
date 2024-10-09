import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import {
  TASK_DUE_DATE_UUID,
  TASK_PRIORITY_UUID,
  TASK_STATUS_UUID,
  useCreateTask,
} from "../../../../store/tasksStore";
import {
  TAG_PRIORITY_HIGH_UUID,
  TAG_PRIORITY_LOW_UUID,
  TAG_PRIORITY_MEDIUM_UUID,
} from "../../../../store/tagsStore";

export default function CreateTodoUI() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState<Date>();
  const create = useCreateTask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, description, priority, dueDate });
    create({
      title,
      description,
      properties: {
        [TASK_PRIORITY_UUID]: priority,
        [TASK_DUE_DATE_UUID]: dueDate?.toISOString() ?? "",
        [TASK_STATUS_UUID]: "todo",
      },
    });
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate(undefined);
  };

  return (
    <div className="rounded-lg w-full px-4 py-2">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Create New a To-do</h2>
      </div>
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-gray-700">
          Title
        </label>
        <Input
          id="title"
          placeholder="Enter todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus={true}
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <Textarea
          id="description"
          placeholder="Enter todo description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="priority" className="text-sm font-medium text-gray-700">
          Priority
        </label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TAG_PRIORITY_LOW_UUID}>Low</SelectItem>
            <SelectItem value={TAG_PRIORITY_MEDIUM_UUID}>Medium</SelectItem>
            <SelectItem value={TAG_PRIORITY_HIGH_UUID}>High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
          Due Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${
                !dueDate && "text-muted-foreground"
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button className="w-full mt-4" onClick={handleSubmit}>
        Create Todo
      </Button>
    </div>
  );
}
