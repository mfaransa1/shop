"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/animations/Reveal";

type FormData = {
  fullName: string;
  age: string;
  guardianName: string;
  phone: string;
  email: string;
  school: string;
  experience: string;
  interest: string;
  message: string;
};

const initialForm: FormData = {
  fullName: "",
  age: "",
  guardianName: "",
  phone: "",
  email: "",
  school: "",
  experience: "",
  interest: "",
  message: "",
};

const inputClass =
  "w-full border-0 border-b border-shop-border bg-transparent px-0 py-4 text-base text-shop-ink outline-none transition-colors placeholder:text-shop-muted/50 focus:border-shop-ink";

const labelClass =
  "text-[9px] font-bold uppercase tracking-[0.18em] text-shop-muted";

export default function JoinPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function updateField(
    field: keyof FormData,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);

    // Temporary submission layer.
    // Connect this to your backend/email service later.
    await new Promise((resolve) => setTimeout(resolve, 900));

    setSubmitting(false);
    setSubmitted(true);
  }

  function resetForm() {
    setForm(initialForm);
    setSubmitted(false);
  }

  return (
    <>
      <Navbar />

      <main>
        {/* =========================================================
            HERO
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#111111] text-[#F3EDE2]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -left-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[#F3EDE2]/[0.035] blur-[130px] animate-[join-orb_14s_ease-in-out_infinite]" />

            <div className="absolute -right-40 bottom-0 h-[34rem] w-[34rem] rounded-full bg-[#F3EDE2]/[0.025] blur-[140px] animate-[join-orb-reverse_17s_ease-in-out_infinite]" />
          </div>

          <div className="shop-container relative z-10 py-28 md:py-36 lg:py-44">
            <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
              <div>
                <Reveal>
                  <div className="flex items-center gap-4">
                    <span className="h-px w-10 bg-[#F3EDE2]/40" />

                    <p className="shop-eyebrow text-[#F3EDE2]/55">
                      Join SHoP
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={120}>
                  <h1 className="shop-display mt-8 max-w-5xl text-[clamp(4rem,9vw,9rem)] leading-[0.8]">
                    Find your
                    <br />
                    place at the board.
                  </h1>
                </Reveal>

                <Reveal delay={260}>
                  <p className="mt-10 max-w-xl text-base leading-7 text-[#F3EDE2]/55 sm:text-lg sm:leading-8">
                    Whether you're picking up a chessboard for the first time
                    or already preparing for your next tournament, there is a
                    place for you at SHoP.
                  </p>
                </Reveal>

                <Reveal delay={400}>
                  <div className="mt-10 flex flex-wrap gap-3">
                    <a
                      href="#registration"
                      className="group inline-flex items-center gap-4 bg-[#F3EDE2] px-6 py-4 text-sm font-semibold !text-[#111111] transition-all duration-300 hover:-translate-y-1"
                    >
                      <span className="!text-[#111111]">
                        Register your interest
                      </span>

                      <span className="!text-[#111111] transition-transform duration-300 group-hover:translate-y-1">
                        ↓
                      </span>
                    </a>

                    <Link
                      href="/learn"
                      className="inline-flex items-center gap-4 border border-[#F3EDE2]/25 px-6 py-4 text-sm font-semibold !text-[#F3EDE2] transition-all duration-300 hover:bg-[#F3EDE2] hover:!text-[#111111]"
                    >
                      <span className="!text-current">
                        Explore chess
                      </span>
                    </Link>
                  </div>
                </Reveal>

                <Reveal delay={520}>
                  <div className="mt-14 flex items-center justify-between border-t border-[#F3EDE2]/10 pt-5">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/35">
                      KAWANGWARE · NAIROBI
                    </span>

                    <span className="hidden text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/30 sm:block">
                      SHoP / JOIN
                    </span>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={180}>
                <div className="relative mx-auto w-full max-w-[620px] lg:ml-auto">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F3EDE2]/5">
                    <Image
                      src="/images/sessions/session-01.jpg"
                      alt="Young people playing chess at SHoP"
                      fill
                      priority
                      sizes="(max-width: 1023px) 100vw, 50vw"
                      className="object-cover animate-[join-image-in_1200ms_cubic-bezier(0.22,1,0.36,1)_both]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                    <span className="absolute left-5 top-5 text-[9px] font-bold tracking-[0.2em] text-white/55">
                      SHoP / JOIN
                    </span>

                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="text-[9px] font-bold tracking-[0.2em] text-white/50">
                        YOUR NEXT MOVE
                      </span>

                      <p className="shop-display mt-3 text-3xl leading-none text-white sm:text-4xl">
                        Start where you are.
                      </p>
                    </div>
                  </div>

                  <div className="absolute -bottom-5 -left-4 bg-[#F3EDE2] px-5 py-4 text-[#111111] sm:-left-7">
                    <span className="text-[9px] font-bold tracking-[0.18em]">
                      KILA HATUA INA MAANA
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* =========================================================
            INTRO
        ========================================================= */}
        <section className="bg-shop-cream">
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <div>
                  <p className="shop-eyebrow text-shop-muted">
                    01 — Before you join
                  </p>
                </div>

                <div>
                  <h2 className="shop-display max-w-5xl text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86]">
                    No experience required.
                  </h2>

                  <p className="mt-8 max-w-2xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                    SHoP welcomes young people at different stages of their
                    chess journey. Tell us a little about yourself and we'll
                    help you find the right place to start.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-16 grid border-y border-shop-border sm:grid-cols-3">
                {[
                  ["01", "Beginner", "You've never played or are just starting."],
                  ["02", "Developing", "You know the basics and want to improve."],
                  ["03", "Competitive", "You're ready to challenge yourself."],
                ].map(([number, title, text]) => (
                  <div
                    key={number}
                    className="border-b border-shop-border p-7 last:border-b-0 sm:border-b-0 sm:border-r sm:p-8 sm:last:border-r-0"
                  >
                    <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted">
                      {number}
                    </span>

                    <h3 className="shop-display mt-8 text-3xl">
                      {title}
                    </h3>

                    <p className="mt-4 text-sm leading-6 text-shop-muted">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* =========================================================
            FORM
        ========================================================= */}
        <section
          id="registration"
          className="scroll-mt-20 overflow-hidden bg-[#111111] text-[#F3EDE2]"
        >
          <div className="shop-container py-24 md:py-32 lg:py-40">
            <div className="grid gap-14 lg:grid-cols-[0.55fr_1.45fr] lg:gap-20">
              {/* Form intro */}
              <Reveal>
                <div>
                  <p className="shop-eyebrow text-[#F3EDE2]/45">
                    02 — Registration
                  </p>

                  <h2 className="shop-display mt-8 text-[clamp(3.5rem,6vw,6rem)] leading-[0.85]">
                    Make the
                    <br />
                    first move.
                  </h2>

                  <p className="mt-8 max-w-sm text-sm leading-6 text-[#F3EDE2]/45">
                    Complete the form and tell us a little about yourself.
                    We'll use your details to understand how SHoP can best
                    welcome you.
                  </p>

                  <div className="mt-10 border-t border-[#F3EDE2]/10 pt-6">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#F3EDE2]/30">
                      WHAT HAPPENS NEXT
                    </span>

                    <p className="mt-4 text-sm leading-6 text-[#F3EDE2]/45">
                      We'll review your registration and get in touch with
                      information about sessions and next steps.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Form */}
              <Reveal delay={160}>
                <div className="bg-shop-cream p-6 text-shop-ink sm:p-10 md:p-12 lg:p-14">
                  {submitted ? (
                    <div className="flex min-h-[520px] flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted">
                          REGISTRATION RECEIVED
                        </span>

                        <h3 className="shop-display mt-8 max-w-2xl text-[clamp(3.5rem,7vw,7rem)] leading-[0.82]">
                          You're on
                          <br />
                          the board.
                        </h3>

                        <p className="mt-8 max-w-xl text-base leading-7 text-shop-muted sm:text-lg sm:leading-8">
                          Thanks for registering your interest in SHoP. We'll
                          be in touch with the next steps.
                        </p>
                      </div>

                      <div className="mt-12 flex flex-wrap gap-3">
                        <Link
                          href="/learn"
                          className="inline-flex items-center gap-4 bg-[#111111] px-6 py-4 text-sm font-semibold !text-[#F3EDE2] transition-all duration-300 hover:-translate-y-1"
                        >
                          <span className="!text-[#F3EDE2]">
                            Explore chess
                          </span>

                          <span className="!text-[#F3EDE2]">
                            →
                          </span>
                        </Link>

                        <button
                          type="button"
                          onClick={resetForm}
                          className="inline-flex items-center gap-4 border border-shop-ink/20 px-6 py-4 text-sm font-semibold transition-colors hover:bg-shop-paper"
                        >
                          Submit another
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-10"
                    >
                      {/* Basic details */}
                      <div>
                        <div className="mb-8 flex items-center justify-between">
                          <span className="text-[9px] font-bold tracking-[0.2em] text-shop-muted">
                            YOUR DETAILS
                          </span>

                          <span className="text-[9px] text-shop-muted/60">
                            * REQUIRED
                          </span>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="fullName"
                              className={labelClass}
                            >
                              Full name *
                            </label>

                            <input
                              id="fullName"
                              name="fullName"
                              required
                              value={form.fullName}
                              onChange={(e) =>
                                updateField("fullName", e.target.value)
                              }
                              placeholder="Your full name"
                              className={inputClass}
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="age"
                              className={labelClass}
                            >
                              Age *
                            </label>

                            <input
                              id="age"
                              name="age"
                              required
                              type="number"
                              min="5"
                              max="100"
                              value={form.age}
                              onChange={(e) =>
                                updateField("age", e.target.value)
                              }
                              placeholder="Your age"
                              className={inputClass}
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="phone"
                              className={labelClass}
                            >
                              Phone number *
                            </label>

                            <input
                              id="phone"
                              name="phone"
                              required
                              type="tel"
                              value={form.phone}
                              onChange={(e) =>
                                updateField("phone", e.target.value)
                              }
                              placeholder="e.g. 07XX XXX XXX"
                              className={inputClass}
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="email"
                              className={labelClass}
                            >
                              Email
                            </label>

                            <input
                              id="email"
                              name="email"
                              type="email"
                              value={form.email}
                              onChange={(e) =>
                                updateField("email", e.target.value)
                              }
                              placeholder="you@example.com"
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Guardian */}
                      <div className="border-t border-shop-border pt-8">
                        <label
                          htmlFor="guardianName"
                          className={labelClass}
                        >
                          Parent / Guardian name
                        </label>

                        <input
                          id="guardianName"
                          name="guardianName"
                          value={form.guardianName}
                          onChange={(e) =>
                            updateField("guardianName", e.target.value)
                          }
                          placeholder="Required for younger players"
                          className={inputClass}
                        />
                      </div>

                      {/* School */}
                      <div>
                        <label
                          htmlFor="school"
                          className={labelClass}
                        >
                          School / Organisation
                        </label>

                        <input
                          id="school"
                          name="school"
                          value={form.school}
                          onChange={(e) =>
                            updateField("school", e.target.value)
                          }
                          placeholder="Where do you currently study?"
                          className={inputClass}
                        />
                      </div>

                      {/* Experience */}
                      <div>
                        <label
                          htmlFor="experience"
                          className={labelClass}
                        >
                          Chess experience *
                        </label>

                        <select
                          id="experience"
                          name="experience"
                          required
                          value={form.experience}
                          onChange={(e) =>
                            updateField("experience", e.target.value)
                          }
                          className={`${inputClass} cursor-pointer`}
                        >
                          <option value="">
                            Select your level
                          </option>
                          <option value="beginner">
                            Beginner — I'm new to chess
                          </option>
                          <option value="developing">
                            Developing — I know the basics
                          </option>
                          <option value="intermediate">
                            Intermediate — I play regularly
                          </option>
                          <option value="competitive">
                            Competitive — I play tournaments
                          </option>
                        </select>
                      </div>

                      {/* Interest */}
                      <div>
                        <label
                          htmlFor="interest"
                          className={labelClass}
                        >
                          What are you interested in? *
                        </label>

                        <select
                          id="interest"
                          name="interest"
                          required
                          value={form.interest}
                          onChange={(e) =>
                            updateField("interest", e.target.value)
                          }
                          className={`${inputClass} cursor-pointer`}
                        >
                          <option value="">
                            Select an option
                          </option>
                          <option value="learning">
                            Learning chess
                          </option>
                          <option value="playing">
                            Playing regularly
                          </option>
                          <option value="tournaments">
                            Tournaments
                          </option>
                          <option value="community">
                            Community sessions
                          </option>
                          <option value="all">
                            A bit of everything
                          </option>
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label
                          htmlFor="message"
                          className={labelClass}
                        >
                          Anything you'd like us to know?
                        </label>

                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          value={form.message}
                          onChange={(e) =>
                            updateField("message", e.target.value)
                          }
                          placeholder="Tell us anything that might help..."
                          className={`${inputClass} resize-none`}
                        />
                      </div>

                      {/* Submit */}
                      <div className="border-t border-shop-border pt-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                          <p className="max-w-sm text-xs leading-5 text-shop-muted">
                            By submitting this form, you are registering your
                            interest in joining SHoP.
                          </p>

                          <button
                            type="submit"
                            disabled={submitting}
                            className="group inline-flex w-full items-center justify-center gap-4 bg-[#111111] px-7 py-4 text-sm font-semibold !text-[#F3EDE2] transition-all duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                          >
                            <span className="!text-[#F3EDE2]">
                              {submitting
                                ? "Sending..."
                                : "Submit registration"}
                            </span>

                            <span className="!text-[#F3EDE2] transition-transform duration-300 group-hover:translate-x-1">
                              →
                            </span>
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* =========================================================
            BOTTOM NOTE
        ========================================================= */}
        <section className="bg-shop-cream">
          <div className="shop-container py-20 md:py-28">
            <Reveal>
              <div className="flex flex-col gap-6 border-t border-shop-border pt-7 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-sm leading-6 text-shop-muted">
                  Questions before registering? You can also explore the
                  learning, community and events pages to see what SHoP is
                  about.
                </p>

                <Link
                  href="/community"
                  className="group inline-flex w-fit items-center gap-3 text-sm font-semibold"
                >
                  Meet the community

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}