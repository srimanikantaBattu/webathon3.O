import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  
  // const history = useHistory();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user-api/login`,
        data
      );
      console.log(response)
      console.log("Login successful:", response.data);
      localStorage.setItem("email", response.data.user.email);
      localStorage.setItem("name", response.data.user.name);
      localStorage.setItem("rollno", response.data.user.rollno);
      localStorage.setItem("mobile", response.data.user.mobile);
      localStorage.setItem("fathername", response.data.user.fathername);
      localStorage.setItem("father_mobile", response.data.user.father_mobile);
      localStorage.setItem("room_no", response.data.user.room_no);
      localStorage.setItem("branch", response.data.user.branch);
      localStorage.setItem("startyear", response.data.user.startyear);

      navigate("/");
    } catch (err: any) {
      console.error(
        "Login failed:",
        err.response?.data?.message || err.message
      );
      alert(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-balance text-muted-foreground">
                      Login to your VNR HOSTEL account
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...register("email", { required: true })}
                    />
                    {errors.email && (
                      <span className="text-xs text-red-500">
                        Email is required
                      </span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      {...register("password", { required: true })}
                    />
                    {errors.password && (
                      <span className="text-xs text-red-500">
                        Password is required
                      </span>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </div>
              </form>
              <div className="relative hidden bg-muted md:block">
                <img
                  src="https://content3.jdmagicbox.com/v2/comp/hyderabad/g1/040pxx40.xx40.221231154729.w4g1/catalogue/vnrvjiet-hostels-hyderabad-hostels-A7A6jj6SR3.jpg"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
