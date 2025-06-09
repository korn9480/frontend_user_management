'use client'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { ReactNode, useState } from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import { Button } from "../ui/button"

type ReusableFormFieldProps<T extends FieldValues> = {
  readonly control: Control<T>
  readonly name: FieldPath<T>
  readonly label: string
  readonly placeholder?: string,
  readonly icon?: ReactNode 
}

export function FieldInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  icon
}: ReusableFormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className=" relative">
            <FormControl>
              <div className="relative">
                {icon && (
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {icon}
                  </span>
                )}
                <Input className={`${icon ? "pl-10" : ""} ${fieldState.invalid ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`} placeholder={placeholder} {...field} />
              </div>
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function FieldInputPassword<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  icon
}: ReusableFormFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className=" relative">
            <FormControl>
              <div className="relative">
                {icon && (
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {icon}
                  </span>
                )}
                <Input type={showPassword ? "text" : "password"} 
                  className={`${icon ? "pl-10" : ""} ${fieldState.invalid ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`} placeholder={placeholder} {...field} 
                />
                <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
              </div>
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
