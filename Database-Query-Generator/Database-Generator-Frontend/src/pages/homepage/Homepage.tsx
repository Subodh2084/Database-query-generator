import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Plus, Loader2, Database, Check, ChevronDown } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Button } from "../../components/ui/button";
import { mysqlDatabase, nosqlDatabase } from "../../constant/database.constant";

const Homepage = () => {
  const [selectedDB, setSelectedDB] = useState("mysql");
  const [inputValue, setInputValue] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [enableDesc, setEnableDesc] = useState(false);
  const [fileResponseDesc, setFileResponseDesc] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setInputValue(file.name);
      setFileResponseDesc(null);
    }
  };

  const handleGenerate = async () => {
    if (!inputValue.trim()) return;

    setLoading(true);
    setOutput("");
    setFileResponseDesc(null);

    try {
      if (uploadedFile) {
        const formData = new FormData();
        formData.append("photo", uploadedFile);
        formData.append("userQuery", inputValue);

        const response = await axios.post(
          `http://localhost:3001/api/v1/prompt/image?database=${selectedDB}&enableDesc=${enableDesc}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        setOutput(response.data?.data.modelResponse || "No query returned.");
        if (response.data?.data.issueDescription) {
          setFileResponseDesc(response.data.data.issueDescription);
        }
      } else {
        const response = await axios.post(
          `http://localhost:3001/api/v1/prompt/query-generator?database=${selectedDB}`,
          { content: inputValue }
        );

        setOutput(response.data.data || "No query returned.");
      }
    } catch (error: any) {
      setOutput("Error generating query: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col items-center justify-center space-y-8 px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-cyan-400">
        Database Query Generator
      </h1>

      <div className="w-full max-w-2xl space-y-6">
        <div className="flex flex-col space-y-2">
          <label className="text-white font-medium flex items-center gap-2">
            <Database size={18} /> Select Database
          </label>
          <Select.Root value={selectedDB} onValueChange={setSelectedDB}>
            <Select.Trigger className="flex items-center justify-between px-4 py-2 bg-[#2c2c2c] border border-gray-600 rounded-md w-full text-white focus:outline-none">
              <Select.Value placeholder="Select Database" />
              <Select.Icon className="text-white">
                <ChevronDown size={18} />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content
                position="popper"
                className="bg-[#2c2c2c] text-white rounded-md shadow-md border border-gray-600 mt-2 z-50 max-h-64 overflow-y-auto"
              >
                <Select.Viewport className="p-2 space-y-2">
                  <Select.Group>
                    <p className="text-xs text-gray-400 px-2">SQL Databases</p>
                    {Object.entries(mysqlDatabase).map(([value, label]) => (
                      <Select.Item
                        key={value}
                        value={value}
                        className="flex items-center justify-between px-3 py-2 rounded hover:bg-[#3a3a3a] cursor-pointer"
                      >
                        <Select.ItemText>{label}</Select.ItemText>
                        <Select.ItemIndicator>
                          {selectedDB === value && <Check size={14} />}
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Group>

                  <div className="h-px bg-gray-600 my-2" />

                  <Select.Group>
                    <p className="text-xs text-gray-400 px-2">
                      NoSQL Databases
                    </p>
                    {Object.entries(nosqlDatabase).map(([value, label]) => (
                      <Select.Item
                        key={value}
                        value={value}
                        className="flex items-center justify-between px-3 py-2 rounded hover:bg-[#3a3a3a] cursor-pointer"
                      >
                        <Select.ItemText>{label}</Select.ItemText>
                        <Select.ItemIndicator>
                          {selectedDB === value && <Check size={14} />}
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-white">Enable Description:</span>
          <Button
            variant="outline"
            className={`px-4 py-1 text-sm rounded-md ${
              enableDesc
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setEnableDesc((prev) => !prev)}
          >
            {enableDesc ? "Enabled" : "Disabled"}
          </Button>
        </div>

        <div className="relative bg-[#2c2c2c] rounded-xl border border-gray-600 p-4">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => {
              if (uploadedFile) setUploadedFile(null);
              setInputValue(e.target.value);
            }}
            placeholder="Ask your query or upload a file"
            className="w-full bg-transparent resize-none outline-none text-white placeholder-gray-400 pr-14"
          />

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          {uploadedFile && (
            <button
              type="button"
              onClick={() => {
                setUploadedFile(null);
                setInputValue("");
                setFileResponseDesc(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute top-3 right-12 text-red-500 hover:text-red-400 font-bold px-2 rounded cursor-pointer select-none"
              title="Remove uploaded file"
              aria-label="Remove uploaded file"
            >
              ✕
            </button>
          )}

          <div className="absolute top-3 right-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="rounded-full h-8 w-8 p-0 hover:bg-[#4b4b4b] bg-[#3a3a3a]"
                  aria-label="Add file"
                >
                  <Plus size={20} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2 rounded-md shadow-xl w-60 space-y-1 bg-[#4b4b4b]">
                <Button
                  variant="ghost"
                  className="w-full justify-between text-left px-3 py-2 text-sm hover:text-white hover:bg-[#6b6b6b]"
                  onClick={handleFileClick}
                >
                  Upload File
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-lg py-2 rounded-md"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : uploadedFile ? (
            "Fix Query"
          ) : (
            "Generate Query"
          )}
        </Button>

        {output && (
          <div className="bg-[#2c2c2c] border border-gray-600 p-4 rounded-xl text-green-400 whitespace-pre-wrap">
            <h2 className="text-white font-semibold mb-2">Generated Query:</h2>
            <code>{output}</code>
          </div>
        )}

        {fileResponseDesc && (
          <div className="bg-[#2c2c2c] border border-gray-600 p-4 rounded-xl text-blue-400 whitespace-pre-wrap">
            <h2 className="text-white font-semibold mb-2">File Description:</h2>
            <p>{fileResponseDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
